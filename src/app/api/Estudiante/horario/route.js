import { NextResponse } from "next/server";
import { getCurrentSession } from "../../../../lib/auth/currentSession";
import prisma from "../../../../lib/prisma";

// Devuelve los cursos y horarios asociados al usuario que inició sesión.
export async function POST() {
  // Lee la cookie y verifica su firma y vencimiento usando SESSION_SECRET.
  // El ID se obtiene de esa sesión, nunca del cuerpo de la petición.
  const sesion = await getCurrentSession();
  if (!sesion) {
    return NextResponse.json({ message: "Debes iniciar sesión para consultar tu horario." }, { status: 401 });
  }

  // Pendiente: activar cuando se implementen los flujos de todos los roles.
  // Mientras esté comentado, cualquier rol con sesión válida puede consultar
  // las inscripciones asociadas a su propio usuario_id.
  // if (sesion.role !== "estudiante") {
  //   return NextResponse.json({ message: "No tienes permiso para consultar este horario." }, { status: 403 });
  // }

  try {
    // La tabla intermedia CursoPorEstudiante relaciona al estudiante con sus cursos.
    // Prisma consulta mediante el adaptador pg y limita los resultados al ID de la sesión.
    const inscripciones = await prisma.cursoPorEstudiante.findMany({
      where: { estudiante_id: sesion.usuario_id },
      // Traemos solo los datos que el frontend necesita; no consultamos al docente.
      select: {
        curso: {
          select: {
            curso_id: true,
            nombre_curso: true,
            nrc: true,
            seccion: true,
            horarios: {
              select: { horario_id: true, dia: true, hora_inicio: true, hora_termino: true },
              // El día se ordena como texto; esto no garantiza orden lunes a viernes.
              orderBy: [{ dia: "asc" }, { hora_inicio: "asc" }],
            },
          },
        },
      },
      orderBy: { curso: { nombre_curso: "asc" } },
    });

    // La consulta entrega inscripciones con el curso anidado. Creamos un arreglo
    // de cursos y conservamos dentro de cada uno todos sus horarios.
    // TIME de PostgreSQL llega como Date: devolvemos solo la hora, sin fecha ni zona horaria.
    const cursos = inscripciones.map(({ curso }) => ({
      ...curso,
      horarios: curso.horarios.map((horario) => ({
        ...horario,
        hora_inicio: horario.hora_inicio.toISOString().slice(11, 19),
        hora_termino: horario.hora_termino.toISOString().slice(11, 19),
      })),
    }));

    // Sin inscripciones se devuelve { cursos: [] }. No se guarda en caché una respuesta personalizada.
    return NextResponse.json({ cursos }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    // El detalle queda en el servidor; la respuesta evita exponer datos internos.
    console.error("Error al consultar los horarios:", error);
    return NextResponse.json({ message: "No fue posible consultar los horarios." }, { status: 500 });
  }
}
