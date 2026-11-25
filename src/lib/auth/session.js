import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "justificaciones_session";
export const SESSION_MAX_AGE = 8 * 60 * 60;
const SESSION_VERSION = 1;
const ROLES = ["estudiante", "docente", "administrador"];

function sign(encoded) {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET debe tener al menos 32 caracteres.");
  return createHmac("sha256", secret).update(encoded).digest("base64url");
}

export function createSessionToken({ usuario_id, role, nombre, apellido }) {
  if (!Number.isSafeInteger(usuario_id) || usuario_id <= 0 || !ROLES.includes(role) ||
      typeof nombre !== "string" || typeof apellido !== "string") {
    throw new Error("Los datos de la sesión no son válidos.");
  }
  const payload = { version: SESSION_VERSION, usuario_id, role, nombre, apellido, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function readSessionToken(token) {
  if (typeof token !== "string" || token.length > 4096) return null;
  const [encoded, signature, extra] = token.split(".");
  if (!encoded || !signature || extra !== undefined) return null;

  try {
    // La firma detecta cambios en los datos antes de confiar en ellos.
    const expected = Buffer.from(sign(encoded));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (!payload || payload.version !== SESSION_VERSION || !Number.isSafeInteger(payload.usuario_id) || payload.usuario_id <= 0 ||
        !ROLES.includes(payload.role) || typeof payload.nombre !== "string" || typeof payload.apellido !== "string" ||
        !Number.isSafeInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
