import { NextResponse } from "next/server";
import { getCurrentSession } from "../../../../lib/auth/currentSession";
import prisma from "../../../../lib/prisma";

// Registra el dispositivo para el usuario de la sesión actual.
export async function POST(request) {
  const sesion = await getCurrentSession();
  if (!sesion) return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  if (!["administrador", "estudiante"].includes(sesion.role)) return NextResponse.json({ message: "Acceso no autorizado." }, { status: 403 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ message: "Origen no permitido." }, { status: 403 });

  let datos;
  try { datos = await request.json(); } catch { return NextResponse.json({ message: "Solicitud no válida." }, { status: 400 }); }
  const { endpoint, keys } = datos ?? {};
  let url;
  try { url = new URL(endpoint); } catch { return NextResponse.json({ message: "Suscripción no válida." }, { status: 400 }); }
  // Solo aceptamos servicios push conocidos para evitar guardar destinos arbitrarios.
  const proveedorValido = url.hostname === "fcm.googleapis.com" || url.hostname === "updates.push.services.mozilla.com" || url.hostname.endsWith(".push.apple.com");
  const claveValida = (valor, longitud) => typeof valor === "string" && /^[A-Za-z0-9_-]+$/.test(valor) && Buffer.from(valor, "base64url").length === longitud;
  if (typeof endpoint !== "string" || endpoint.length > 2048 || url.protocol !== "https:" || url.username || url.password || url.port || !proveedorValido || !claveValida(keys?.p256dh, 65) || !claveValida(keys?.auth, 16)) {
    return NextResponse.json({ message: "Suscripción no válida." }, { status: 400 });
  }
  try {
    // Si el navegador ya estaba registrado, se actualiza y se asocia a la sesión actual.
    await prisma.pushSuscription.upsert({
      where: { endpoint },
      create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, usuario_id: sesion.usuario_id },
      update: { p256dh: keys.p256dh, auth: keys.auth, usuario_id: sesion.usuario_id, activo: true },
    });
    return NextResponse.json({ message: "Dispositivo suscrito." }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Error al guardar la suscripción:", error);
    return NextResponse.json({ message: "No fue posible guardar la suscripción." }, { status: 500 });
  }
}
