import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const RECORD_ID = "1";
const allowedExtensions = new Set(["pdf", "ppt", "pptx", "jpg", "jpeg", "png", "webp"]);

function getExtension(fileName) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

async function redcapRequest(body) {
  const response = await fetch(process.env.REDCAP_API_URL, { body, method: "POST" });
  const responseText = await response.text();

  if (!response.ok) throw new Error(`REDCap respondió con el estado ${response.status}.`);

  try {
    const responseData = JSON.parse(responseText);
    if (responseData?.error) throw new Error(responseData.error);
    return responseData;
  } catch (error) {
    if (error instanceof SyntaxError) return responseText;
    throw error;
  }
}

export async function POST(request) {
  if (!process.env.REDCAP_API_URL || !process.env.REDCAP_API_TOKEN) {
    return NextResponse.json({ message: "La integración con REDCap no está configurada." }, { status: 500 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "No se pudieron procesar los datos del formulario." }, { status: 400 });
  }

  const certificate = formData.get("certificado");
  const comments = String(formData.get("comentarios") ?? "").trim();

  if (!(certificate instanceof File) || certificate.size === 0) {
    return NextResponse.json({ message: "Debes adjuntar un certificado médico o licencia médica." }, { status: 400 });
  }

  if (certificate.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: "El archivo supera el límite permitido de 100 MB." }, { status: 400 });
  }

  if (!allowedExtensions.has(getExtension(certificate.name))) {
    return NextResponse.json({ message: "El tipo de archivo seleccionado no está permitido." }, { status: 400 });
  }

  if (comments.length > 5000) {
    return NextResponse.json({ message: "Los antecedentes adicionales no pueden superar 5.000 caracteres." }, { status: 400 });
  }

  try {
    const recordPayload = new URLSearchParams({
      content: "record",
      data: JSON.stringify([{ comentarios: comments, record_id: RECORD_ID }]),
      format: "json",
      returnContent: "count",
      token: process.env.REDCAP_API_TOKEN,
      type: "flat",
    });
    await redcapRequest(recordPayload);

    const filePayload = new FormData();
    filePayload.append("token", process.env.REDCAP_API_TOKEN);
    filePayload.append("content", "file");
    filePayload.append("action", "import");
    filePayload.append("record", RECORD_ID);
    filePayload.append("field", "certificado");
    filePayload.append("file", certificate, certificate.name);
    await redcapRequest(filePayload);

    return NextResponse.json({ message: "Justificación enviada correctamente a REDCap.", recordId: RECORD_ID });
  } catch (error) {
    console.error("Error al enviar la justificación a REDCap:", error);
    return NextResponse.json({ message: "REDCap no pudo registrar la justificación." }, { status: 502 });
  }
}
