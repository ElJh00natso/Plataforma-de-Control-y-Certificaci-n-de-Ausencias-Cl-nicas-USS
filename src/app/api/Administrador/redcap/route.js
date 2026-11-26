import { NextResponse } from "next/server";
import { getCurrentSession } from "../../../../lib/auth/currentSession";

// Consulta los antecedentes de un registro REDCap, sin modificarlo.
export async function POST(request) {
  const sesion = await getCurrentSession();
  if (!sesion) return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  if (sesion.role !== "administrador") return NextResponse.json({ message: "Acceso solo para administradores." }, { status: 403 });

  let datos;
  try { datos = await request.json(); } catch {
    return NextResponse.json({ message: "Solicitud no válida." }, { status: 400 });
  }
  const redcapId = datos?.redcapId;
  if (typeof redcapId !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(redcapId)) {
    return NextResponse.json({ message: "Identificador de REDCap no válido." }, { status: 400 });
  }
  if (!process.env.REDCAP_API_URL || !process.env.REDCAP_API_TOKEN) {
    return NextResponse.json({ message: "REDCap no está configurado." }, { status: 503 });
  }

  try {
    // Limitamos la exportación al registro solicitado y a los campos necesarios.
    const body = new URLSearchParams({ token: process.env.REDCAP_API_TOKEN, content: "record", format: "json", type: "flat", "records[0]": redcapId, "fields[0]": "record_id", "fields[1]": "comentarios", "fields[2]": "certificado", returnFormat: "json" });
    const respuesta = await fetch(process.env.REDCAP_API_URL, { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(15000) });
    if (!respuesta.ok) throw new Error(`REDCap respondió con estado ${respuesta.status}`);
    const registros = await respuesta.json();
    if (!Array.isArray(registros)) throw new Error("Respuesta inesperada de REDCap");
    const registro = registros.find((item) => String(item.record_id) === redcapId);
    if (!registro) return NextResponse.json({ message: "No se encontró el registro en REDCap." }, { status: 404 });
    return NextResponse.json({ comentarios: registro.comentarios || "", certificado: registro.certificado || "" }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    console.error("Error al consultar REDCap:", error.message);
    return NextResponse.json({ message: "No fue posible consultar REDCap." }, { status: 502 });
  }
}
