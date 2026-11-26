import { NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { getCurrentSession } from "../../../../../lib/auth/currentSession";

// Exporta el archivo de REDCap desde el servidor, sin exponer el token al navegador.
export async function POST(request) {
  const sesion = await getCurrentSession();
  if (!sesion) return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });
  if (sesion.role !== "administrador") return NextResponse.json({ message: "Acceso solo para administradores." }, { status: 403 });

  let datos;
  try { datos = await request.json(); } catch { return NextResponse.json({ message: "Solicitud no válida." }, { status: 400 }); }
  const redcapId = datos?.redcapId;
  if (typeof redcapId !== "string" || !/^[A-Za-z0-9_-]{1,100}$/.test(redcapId)) return NextResponse.json({ message: "Identificador de REDCap no válido." }, { status: 400 });
  if (!process.env.REDCAP_API_URL || !process.env.REDCAP_API_TOKEN) return NextResponse.json({ message: "REDCap no está configurado." }, { status: 503 });

  try {
    const body = new URLSearchParams({ token: process.env.REDCAP_API_TOKEN, content: "file", action: "export", record: redcapId, field: "certificado", returnFormat: "json" });
    const respuesta = await fetch(process.env.REDCAP_API_URL, { method: "POST", body, cache: "no-store", signal: AbortSignal.timeout(30000) });
    if (!respuesta.ok) throw new Error(`REDCap respondió con estado ${respuesta.status}`);
    // Verificamos la firma para no entregar un mensaje de error de REDCap como archivo.
    const archivo = new Uint8Array(await respuesta.arrayBuffer());
    if (!archivo.length || archivo.length > 10 * 1024 * 1024) throw new Error("Archivo vacío o demasiado grande");
    const tipo = await fileTypeFromBuffer(archivo);
    const extensiones = { pdf: "pdf", cfb: "ppt", pptx: "pptx", jpg: "jpg", png: "png", webp: "webp" };
    const extension = tipo && extensiones[tipo.ext];
    if (!extension) throw new Error("Archivo ausente o formato no reconocido");
    return new Response(archivo, { headers: { "Content-Type": "application/octet-stream", "Content-Disposition": `attachment; filename="certificado.${extension}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    console.error("Error al exportar certificado:", error.message);
    return NextResponse.json({ message: "No fue posible descargar el certificado desde REDCap." }, { status: 502, headers: { "Cache-Control": "private, no-store" } });
  }
}
