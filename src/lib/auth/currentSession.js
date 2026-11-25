import { cookies } from "next/headers";
import { readSessionToken, SESSION_COOKIE } from "./session";

// Obtiene la cookie de la petición actual y delega la validación del token.
// El rol debe comprobarlo cada ruta según sus permisos.
export async function getCurrentSession() {
  const cookieStore = await cookies();
  return readSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}
