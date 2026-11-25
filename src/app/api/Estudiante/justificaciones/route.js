import { NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { getCurrentSession } from "../../../../lib/auth/currentSession";
import prisma from "../../../../lib/prisma";

// Tamaño máximo aceptado para el certificado, expresado en bytes (10 MiB).
const MAX_FILE_SIZE = 10 * 1024 * 1024;
// ID provisional requerido en la importación: con forceAutoNumber, REDCap asigna otro.
const PLACEHOLDER_ID = "1";
// Extensiones que el endpoint acepta según el nombre del archivo.
const allowedExtensions = new Set(["pdf", "ppt", "pptx", "jpg", "jpeg", "png", "webp"]);
// La firma esperada se compara con la extensión; PPT antiguo usa el contenedor CFB.
const expectedTypes = { pdf: "pdf", ppt: "cfb", pptx: "pptx", jpg: "jpg", jpeg: "jpg", png: "png", webp: "webp" };

// Extrae la parte posterior al último punto y la pasa a minúsculas para compararla.
// Esta comprobación usa el nombre; por sí sola no garantiza el contenido del archivo.
function getExtension(fileName) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

// Envía una petición POST a REDCap, tanto para registrar datos como para subir el archivo.
async function redcapRequest(body) {
  const response = await fetch(process.env.REDCAP_API_URL, { body, method: "POST" });
  // Leemos texto primero porque REDCap puede responder con JSON o texto sin formato.
  const responseText = await response.text();

  // Si REDCap responde con error HTTP, detenemos el proceso para informar el fallo.
  if (!response.ok) throw new Error(`REDCap respondió con el estado ${response.status}.`);

  try {
    // Si la respuesta es JSON, comprobamos también si contiene un mensaje de error.
    const responseData = JSON.parse(responseText);
    if (responseData?.error) throw new Error(responseData.error);
    return responseData;
  } catch (error) {
    // Si no era JSON, conservamos el texto; otros errores se propagan al endpoint.
    if (error instanceof SyntaxError) return responseText;
    throw error;
  }
}

// Recibe los datos del formulario de justificación del estudiante.
export async function POST(request) {
  // La cookie se verifica en el servidor: firma con SESSION_SECRET y vencimiento.
  const sesion = await getCurrentSession();
  if (!sesion) {
    return NextResponse.json({ message: "Debes iniciar sesión para enviar una justificación." }, { status: 401 });
  }

  // Pendiente: comprobar que sesion.role sea estudiante cuando se habiliten los roles.

  if (!process.env.REDCAP_API_URL || !process.env.REDCAP_API_TOKEN) {
    return NextResponse.json({ message: "La integración con REDCap no está configurada." }, { status: 500 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "No se pudieron procesar los datos del formulario." }, { status: 400 });
  }

  const certificates = formData.getAll("certificado");
  const certificate = certificates[0];
  const commentValues = formData.getAll("comentarios");
  const horarioValues = formData.getAll("horario_id");

  // Aceptamos un archivo y, como máximo, un campo de texto para comentarios.
  if (certificates.length !== 1 || commentValues.length > 1 || (commentValues.length === 1 && typeof commentValues[0] !== "string")) {
    return NextResponse.json({ message: "Los datos enviados no son válidos." }, { status: 400 });
  }
  const comments = (commentValues[0] ?? "").trim();

  // Aceptamos un único ID numérico positivo dentro del rango de INTEGER de PostgreSQL.
  if (horarioValues.length !== 1 || typeof horarioValues[0] !== "string" || !/^[1-9]\d{0,9}$/.test(horarioValues[0]) || Number(horarioValues[0]) > 2147483647) {
    return NextResponse.json({ message: "Selecciona un horario válido." }, { status: 400 });
  }
  const horarioId = Number(horarioValues[0]);

  // Verificamos que se haya recibido un archivo no vacío, no solo texto con ese nombre.
  if (!(certificate instanceof File) || certificate.size === 0) {
    return NextResponse.json({ message: "Debes adjuntar un certificado médico o licencia médica." }, { status: 400 });
  }

  // El límite se aplica también en el servidor, aunque el navegador ya lo haya revisado.
  if (certificate.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: "El archivo supera el límite permitido de 10 MB." }, { status: 400 });
  }

  // Revisamos la extensión contra la lista permitida antes de inspeccionar el contenido.
  const extension = getExtension(certificate.name);
  if (!allowedExtensions.has(extension)) {
    return NextResponse.json({ message: "El tipo de archivo seleccionado no está permitido." }, { status: 400 });
  }

  // Limitamos el texto adicional a 5.000 caracteres para evitar entradas excesivas.
  if (comments.length > 5000) {
    return NextResponse.json({ message: "Los antecedentes adicionales no pueden superar 5.000 caracteres." }, { status: 400 });
  }

  let detected;
  try {
    // Comprobamos que la firma binaria coincida con la extensión; no sustituye un antivirus.
    detected = await fileTypeFromBuffer(new Uint8Array(await certificate.arrayBuffer()));
  } catch {
    return NextResponse.json({ message: "No fue posible validar el formato del archivo." }, { status: 400 });
  }
  if (!detected || detected.ext !== expectedTypes[extension]) {
    return NextResponse.json({ message: "El contenido del archivo no coincide con su formato permitido." }, { status: 400 });
  }

  let horario;
  try {
    // El ID del cliente solo sirve para buscar: la inscripción se comprueba con la sesión.
    horario = await prisma.horario.findFirst({
      where: { horario_id: horarioId, curso: { estudiantes: { some: { estudiante_id: sesion.usuario_id } } } },
      select: {
        curso: {
          select: {
            nrc: true,
            docente: { select: { nombre: true, apellido: true } },
            estudiantes: {
              where: { estudiante_id: sesion.usuario_id },
              select: { estudiante: { select: { nombre: true, apellido: true, usuario: { select: { rut: true } } } } },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al consultar la actividad:", error);
    return NextResponse.json({ message: "No fue posible verificar la actividad seleccionada." }, { status: 500 });
  }
  if (!horario || horario.curso.estudiantes.length !== 1) {
    return NextResponse.json({ message: "La actividad seleccionada no está disponible para tu cuenta." }, { status: 404 });
  }
  const estudiante = horario.curso.estudiantes[0].estudiante;
  const docente = horario.curso.docente;

  let recordId;
  try {
    const recordPayload = new URLSearchParams({
      content: "record",
      // Solo el certificado y los comentarios vienen del formulario; los demás datos se verifican en la BD.
      data: JSON.stringify([{ record_id: PLACEHOLDER_ID, nombre: `${estudiante.nombre} ${estudiante.apellido}`, rut: estudiante.usuario.rut, nrc: horario.curso.nrc, nombre_profesor: `${docente.nombre} ${docente.apellido}`, comentarios: comments }]),
      format: "json",
      forceAutoNumber: "true",
      returnContent: "ids",
      returnFormat: "json",
      token: process.env.REDCAP_API_TOKEN,
      type: "flat",
    });
    const createdIds = await redcapRequest(recordPayload);
    if (!Array.isArray(createdIds) || createdIds.length !== 1 || !String(createdIds[0] ?? "").trim()) {
      throw new Error("REDCap no devolvió el identificador del registro creado.");
    }
    recordId = String(createdIds[0]);

    const filePayload = new FormData();
    filePayload.append("token", process.env.REDCAP_API_TOKEN);
    filePayload.append("content", "file");
    filePayload.append("action", "import");
    filePayload.append("record", recordId);
    filePayload.append("field", "certificado");
    filePayload.append("file", certificate, certificate.name);
    await redcapRequest(filePayload);

    return NextResponse.json({ message: "Justificación enviada correctamente a REDCap.", recordId });
  } catch (error) {
    console.error("Error al enviar la justificación a REDCap:", error);
    if (recordId) {
      return NextResponse.json({ message: `Se creó el registro ${recordId}, pero no se pudo adjuntar el certificado. Contacta al administrador antes de intentar nuevamente.`, recordId }, { status: 502 });
    }
    return NextResponse.json({ message: "No se pudo confirmar la creación en REDCap. Contacta al administrador antes de intentar nuevamente." }, { status: 502 });
  }
}
