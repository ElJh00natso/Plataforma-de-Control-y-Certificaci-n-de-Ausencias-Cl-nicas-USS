"use client";

import { useEffect, useState } from "react";
import HorarioSemanal from "../../../components/schedule/HorarioSemanal";
import HorarioSkeleton from "../../../components/schedule/HorarioSkeleton";

export default function RealizarJustificacionPage() {
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    let activo = true;

    async function cargarHorario() {
      try {
        const respuesta = await fetch("/api/Estudiante/horario", { method: "POST", signal: controller.signal });

        if (!respuesta.ok) throw new Error("No fue posible cargar el horario.");
        const datos = await respuesta.json();
        if (!Array.isArray(datos.cursos)) throw new Error("La respuesta del horario no es válida.");
        if (activo) {
          setCursos(datos.cursos);
          setCargando(false);
        }
      } catch (err) {
        if (activo && err.name !== "AbortError") {
          setError("No fue posible cargar el horario. Inténtalo nuevamente.");
          setCargando(false);
        }
      }
    }

    cargarHorario();
    return () => {
      activo = false;
      controller.abort();
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-7 sm:py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#091581]">Actividades clínicas</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Realizar justificación</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Selecciona una actividad clínica asociada a tu NRC para iniciar una solicitud de justificación.
        </p>
      </div>

      {cargando ? <HorarioSkeleton /> : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">{error}</p>
      ) : <HorarioSemanal cursos={cursos} />}
    </main>
  );
}
