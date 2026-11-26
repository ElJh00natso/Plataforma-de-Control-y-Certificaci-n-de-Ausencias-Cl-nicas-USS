import { NextResponse } from "next/server";
import { getCurrentSession } from "../../../../lib/auth/currentSession";
import prisma from "../../../../lib/prisma";

/**
 * Contrato de una solicitud para el frontend.
 * @typedef {Object} JustificacionResumen
 * @property {number} id Identificador de la justificación.
 * @property {string} redcapId Identificador del registro asociado en REDCap.
 * @property {string} fecha Fecha de registro en formato ISO 8601 (UTC).
 * @property {string} estado Estado almacenado en la base de datos.
 * @property {string} estudiante Nombre completo del estudiante.
 * @property {string} curso Nombre del curso.
 * @property {string} nrc NRC del curso.
 * @property {string} docente Nombre completo del docente.
 */

export async function GET() {
  // Lee la cookie de sesión y verifica su firma con SESSION_SECRET, su formato
  // y su vencimiento. Si falta o no es válida, getCurrentSession devuelve null.
  const sesion = await getCurrentSession();
  if (!sesion) return NextResponse.json({ message: "Debes iniciar sesión." }, { status: 401 });

  // Una sesión válida no basta: solo un administrador puede consultar esta lista.
  if (sesion.role !== "administrador") return NextResponse.json({ message: "Acceso solo para administradores." }, { status: 403 });

  try {
    // Consultamos las diez solicitudes más recientes y solo los datos de la tarjeta.
    const justificaciones = await prisma.justificacion.findMany({
      orderBy: [{ fecha: "desc" }, { justificacion_id: "desc" }],
      take: 10,
      select: {
        justificacion_id: true, record_id: true, fecha: true, estado: true,
        estudiante: { select: { nombre: true, apellido: true } },
        horario: { select: { curso: { select: { nombre_curso: true, nrc: true, docente: { select: { nombre: true, apellido: true } } } } } },
      },
    });
    // Transformamos las relaciones de Prisma al contrato plano que consume la interfaz.
    // La respuesta exitosa es { justificaciones: JustificacionResumen[] };
    // si no hay registros, justificaciones es un arreglo vacío.
    /** @type {JustificacionResumen[]} */
    const resumenes = justificaciones.map((item) => ({
      id: item.justificacion_id,
      redcapId: item.record_id,
      fecha: item.fecha.toISOString(),
      estado: item.estado,
      estudiante: `${item.estudiante.nombre} ${item.estudiante.apellido}`,
      curso: item.horario.curso.nombre_curso,
      nrc: item.horario.curso.nrc,
      docente: `${item.horario.curso.docente.nombre} ${item.horario.curso.docente.apellido}`,
    }));
    // La respuesta es privada y no debe guardarse en caché.
    return NextResponse.json({ justificaciones: resumenes }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    // El detalle queda en el servidor; el cliente recibe un mensaje general.
    console.error("Error al consultar justificaciones:", error);
    return NextResponse.json({ message: "No fue posible consultar las justificaciones." }, { status: 500 });
  }
}
