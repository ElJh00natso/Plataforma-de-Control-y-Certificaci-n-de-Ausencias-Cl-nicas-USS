import { cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE } from "./session";

// Cada ruta protegida debe validar la firma, el vencimiento y el rol antes de autorizar.
export async function getCurrentSession() {
  const cookieStore = await cookies();
  return readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}
