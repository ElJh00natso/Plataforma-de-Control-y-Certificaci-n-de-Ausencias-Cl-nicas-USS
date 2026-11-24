import { NextResponse } from "next/server";
import { validarCredencialesTemporales } from "../../../../lib/auth/credencialesTemporales";

export async function POST(request) {
  let credentials;

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ message: "La solicitud no contiene datos válidos." }, { status: 400 });
  }

  const { rut, password } = credentials;

  if (typeof rut !== "string" || typeof password !== "string" || !rut.trim() || !password) {
    return NextResponse.json({ message: "RUT y contraseña son obligatorios." }, { status: 400 });
  }

  const user = validarCredencialesTemporales({ rut, password });

  if (!user) {
    return NextResponse.json({ message: "RUT o contraseña incorrectos." }, { status: 401 });
  }

  return NextResponse.json({
    message: "Credenciales validadas.",
    user: {
      rut,
      nombre: user.nombre,
      apellido: user.apellido,
      role: user.role,
    },
  });
}
