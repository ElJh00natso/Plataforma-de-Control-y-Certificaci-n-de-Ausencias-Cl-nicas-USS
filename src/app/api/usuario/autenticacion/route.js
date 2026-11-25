import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "../../../../lib/auth/session";

// Hash de relleno, sin usuario asociado. Cuando no existe el RUT, ejecutamos
// bcrypt igualmente para reducir diferencias de tiempo que revelen cuentas.
const DUMMY_HASH = "$2b$12$WEEwu9wHzjfmWybT/iYFye6UcwGg.BRGZ0TrSjd04PFYee/GR7eXW";

export async function POST(request) {
  let credentials;

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ message: "La solicitud no contiene datos válidos." }, { status: 400 });
  }

  if (!credentials || typeof credentials !== "object" || Array.isArray(credentials)) {
    return NextResponse.json({ message: "La solicitud no contiene datos válidos." }, { status: 400 });
  }

  const { rut, password } = credentials;

  if (typeof rut !== "string" || typeof password !== "string" || !rut.trim() || !password) {
    return NextResponse.json({ message: "RUT y contraseña son obligatorios." }, { status: 400 });
  }

  // bcrypt solo procesa hasta 72 bytes: rechazamos entradas más largas para evitar truncarlas.
  if (rut.length > 20 || Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json({ message: "RUT o contraseña incorrectos." }, { status: 401 });
  }

  // Comparamos con el RUT almacenado sin puntos, guion ni espacios y con la K mayúscula.
  const normalizedRut = rut.replace(/[.\-\s]/g, "").toUpperCase();
  if (!/^\d{7,8}[\dK]$/.test(normalizedRut)) {
    return NextResponse.json({ message: "RUT o contraseña incorrectos." }, { status: 401 });
  }

  try {
    // Prisma consulta mediante el adaptador pg y solo trae los campos necesarios para el login.
    const user = await prisma.usuario.findUnique({
      where: { rut: normalizedRut },
      select: {
        usuario_id: true,
        pass_hash: true,
        estudiante: { select: { nombre: true, apellido: true } },
        docente: { select: { nombre: true, apellido: true } },
        administrador: { select: { nombre: true, apellido: true } },
      },
    });

    // Si el usuario existe comparamos con su hash; si no, con el hash de relleno.
    // La comprobación de user impide acceder aunque coincida con el hash de relleno.
    const validPassword = await bcrypt.compare(password, user?.pass_hash ?? DUMMY_HASH);
    if (!user || !validPassword) {
      return NextResponse.json({ message: "RUT o contraseña incorrectos." }, { status: 401 });
    }

    // El rol se obtiene de las tablas relacionadas; por ahora se exige exactamente uno.
    const roles = ["estudiante", "docente", "administrador"].filter((role) => user[role]);
    if (roles.length !== 1) {
      console.error("La cuenta no tiene exactamente un perfil asignado.");
      return NextResponse.json({ message: "No fue posible iniciar sesión. Contacta al administrador." }, { status: 403 });
    }

    const role = roles[0];
    const sessionUser = { usuario_id: user.usuario_id, nombre: user[role].nombre, apellido: user[role].apellido, role };
    const token = createSessionToken(sessionUser);
    const response = NextResponse.json({ message: "Inicio de sesión exitoso.", user: sessionUser });
    // HttpOnly evita que JavaScript lea la cookie; Secure se aplica en producción con HTTPS.
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error("Error al validar credenciales:", error);
    return NextResponse.json({ message: "No fue posible validar las credenciales en este momento." }, { status: 503 });
  }
}
