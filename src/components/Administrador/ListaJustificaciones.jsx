"use client";

import { useEffect, useState } from "react";

import { clasificarEstado } from "../justifications/useJustificaciones";
import ModalJustificacion from "./ModalJustificacion";

const estados = {
  en_revision: { texto: "En revisión", color: "border-amber-200 bg-amber-50 text-amber-800" },
  aprobadas: { texto: "Aprobada", color: "border-emerald-200 bg-emerald-50 text-emerald-800" },
  rechazadas: { texto: "Rechazada", color: "border-rose-200 bg-rose-50 text-rose-800" },
  otros: { texto: "Estado no reconocido", color: "border-slate-200 bg-slate-50 text-slate-700" },
};

export default function ListaJustificaciones() {
  const [busqueda, setBusqueda] = useState("");
  const [estadoConsulta, setEstadoConsulta] = useState("cargando");
  const [justificaciones, setJustificaciones] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function consultarJustificaciones() {
      try {
        const response = await fetch("/api/Administrador/justificaciones", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("No fue posible consultar las justificaciones.");
        const datos = await response.json();
        if (!Array.isArray(datos.justificaciones)) throw new Error("Respuesta no válida.");
        // El endpoint entrega los datos ya preparados; aquí solo añadimos formato visual.
        setJustificaciones(datos.justificaciones.map((item) => ({
          ...item,
          id: `JUS-${item.id}`,
          ...estados[clasificarEstado(item.estado)],
        })));
        setEstadoConsulta("disponible");
      } catch (error) {
        if (error.name !== "AbortError") setEstadoConsulta("no_disponible");
      }
    }

    consultarJustificaciones();
    return () => controller.abort();
  }, []);
  const termino = busqueda.trim().toLocaleLowerCase("es");
  const resultados = justificaciones.filter((item) =>
    [item.estudiante, item.curso, item.nrc, item.docente, item.id].some((valor) => valor.toLocaleLowerCase("es").includes(termino)),
  );

  return (
    <section aria-label="Solicitudes recientes" className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        {estadoConsulta === "no_disponible" && <p role="alert" className="mb-3 text-xs text-rose-700">No fue posible consultar las justificaciones. Inténtalo nuevamente.</p>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Buscar justificaciones</span>
            <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" strokeWidth="1.8" /><path d="m16 16 4 4" strokeLinecap="round" strokeWidth="1.8" /></svg>
            <input className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#091581] focus:ring-4 focus:ring-[#e8eef8]" onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por estudiante, curso, NRC o docente..." type="search" value={busqueda} />
          </label>
          {estadoConsulta === "disponible" && <p aria-live="polite" className="shrink-0 text-sm text-slate-500">{resultados.length} {resultados.length === 1 ? "solicitud" : "solicitudes"}</p>}
        </div>
      </div>
      {estadoConsulta === "cargando" ? (
        <div role="status" aria-label="Cargando justificaciones" className="divide-y divide-slate-200">
          {[1, 2, 3].map((fila) => <div key={fila} aria-hidden="true" className="flex animate-pulse items-center justify-between gap-4 px-5 py-6 motion-reduce:animate-none sm:px-6"><div className="w-full space-y-3"><div className="h-4 w-44 max-w-full rounded bg-slate-200" /><div className="h-3 w-80 max-w-full rounded bg-slate-100" /></div><div className="h-7 w-24 shrink-0 rounded-full bg-slate-100" /></div>)}
          <span className="sr-only">Cargando justificaciones…</span>
        </div>
      ) : resultados.length ? (
        <ul className="divide-y divide-slate-200">
          {resultados.map((item) => (
            <li key={item.id}>
              <button type="button" onClick={() => setSeleccionada(item)} className="flex w-full flex-col gap-3 px-5 py-5 text-left transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#091581] sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-800">{item.estudiante}</h2><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">{item.id}</span></div>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{item.curso} · NRC {item.nrc} <span className="mx-1 text-slate-300">•</span> Prof. {item.docente}</p>
              </div>
              <span className={`w-fit shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${item.color}`}>{item.texto}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : estadoConsulta === "disponible" && <div className="px-6 py-10 text-center text-sm text-slate-500"><p>{justificaciones.length === 0 ? "Aún no hay justificaciones registradas." : "No se encontraron solicitudes que coincidan con la búsqueda."}</p>{justificaciones.length === 0 && <button type="button" onClick={() => setSeleccionada({ id: "Ejemplo", estudiante: "Estudiante de ejemplo", curso: "Actividad de ejemplo", nrc: "—", docente: "Docente de ejemplo", texto: "En revisión" })} className="mt-4 rounded-xl border border-slate-200 px-4 py-2 font-semibold text-[#091581] hover:bg-slate-50">Ver ejemplo del detalle</button>}</div>}
      {seleccionada && <ModalJustificacion justificacion={seleccionada} onClose={() => setSeleccionada(null)} />}
    </section>
  );
}
