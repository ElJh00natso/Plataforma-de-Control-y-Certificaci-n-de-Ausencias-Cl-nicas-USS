"use client";

import Link from "next/link";
import { clasificarEstado, useJustificaciones } from "../../../components/justifications/useJustificaciones";

const estados = {
  aprobadas: { texto: "Aprobada", estilo: "bg-emerald-50 text-emerald-800" },
  en_revision: { texto: "En revisión", estilo: "bg-amber-50 text-amber-800" },
  rechazadas: { texto: "Rechazada", estilo: "bg-red-50 text-red-800" },
  otros: { texto: "Estado no reconocido", estilo: "bg-slate-100 text-slate-700" },
};

function fechaEnvio(fecha) {
  const valor = new Date(fecha);
  if (Number.isNaN(valor.getTime())) return "Fecha no disponible";
  return new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Santiago" }).format(valor);
}

function hora(valor) {
  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? "--:--" : fecha.toISOString().slice(11, 16);
}

export default function HistorialPage() {
  const { cargando, error, justificaciones, actualizar } = useJustificaciones();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm font-semibold tracking-[0.12em] text-[#315d8f]">ESTUDIANTE</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-[#00264c]">Mis justificaciones</h1><p className="mt-2 text-sm text-slate-600">Consulta tus solicitudes y las respuestas recibidas.</p></div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-[#091581] hover:bg-slate-50 disabled:opacity-50" disabled={cargando} onClick={actualizar} type="button">Actualizar</button>
          <Link className="rounded-xl bg-[#091581] px-4 py-3 text-sm font-semibold text-white hover:bg-[#060e5e]" href="/Estudiante/realizar-justificacion">Realizar justificación</Link>
        </div>
      </div>
      {cargando ? <p className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-600" role="status">Cargando tus justificaciones…</p> : error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700" role="alert">{error}</p>
      ) : justificaciones.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm"><p className="font-semibold text-slate-800">Aún no tienes justificaciones registradas.</p><p className="mt-2 text-sm">Cuando envíes una solicitud, aparecerá aquí.</p></div>
      ) : (
        <ul className="space-y-4">
          {justificaciones.map((item) => {
            const estado = estados[clasificarEstado(item.estado)];
            return <li className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" key={item.justificacion_id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="text-xs font-bold uppercase tracking-wider text-[#315d8f]">Solicitud #{item.justificacion_id}</p><h2 className="mt-1 text-lg font-bold text-slate-800">{item.horario.curso.nombre_curso}</h2><p className="mt-1 text-sm text-slate-600">NRC {item.horario.curso.nrc} · {item.horario.dia} {hora(item.horario.hora_inicio)}–{hora(item.horario.hora_termino)}</p></div>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${estado.estilo}`}>{estado.texto}</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">Enviada: {fechaEnvio(item.fecha)}</p>
              <div className="mt-4 rounded-xl bg-slate-50 p-4"><h3 className="text-sm font-bold text-slate-700">Respuesta</h3><p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">{item.respuesta?.trim() || "Aún no hay una respuesta registrada."}</p></div>
            </li>;
          })}
        </ul>
      )}
    </main>
  );
}
