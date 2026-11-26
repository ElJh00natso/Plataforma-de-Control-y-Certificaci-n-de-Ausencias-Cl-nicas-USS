import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "../../../../lib/auth/session";

export async function POST() {
  const respuesta = NextResponse.json({ message: "Sesión cerrada." }, { headers: { "Cache-Control": "no-store" } });
  // Caducamos la cookie con la misma ruta usada al iniciar sesión.
  respuesta.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return respuesta;
}
