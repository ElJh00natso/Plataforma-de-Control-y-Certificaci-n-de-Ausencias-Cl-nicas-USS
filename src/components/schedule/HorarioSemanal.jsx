"use client";

import { useState } from "react";
import FormularioEstudiante from "../justifications/FormularioEstudiante";

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const ALTURA_HORA = 72;

function normalizarDia(dia) {
  return typeof dia === "string" ? dia.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
}

function minutos(hora) {
  const partes = typeof hora === "string" && /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(hora);
  if (!partes) return null;
  const h = Number(partes[1]);
  const m = Number(partes[2]);
  return h < 24 && m < 60 ? h * 60 + m : null;
}

// Distribuye en columnas las clases que se superponen el mismo día.
function distribuirClases(clases) {
  const ordenadas = [...clases].sort((a, b) => a.inicio - b.inicio || a.fin - b.fin);
  const grupos = [];
  let grupo = [];
  let finGrupo = -1;
  for (const clase of ordenadas) {
    if (grupo.length && clase.inicio >= finGrupo) {
      grupos.push(grupo);
      grupo = [];
      finGrupo = -1;
    }
    grupo.push(clase);
    finGrupo = Math.max(finGrupo, clase.fin);
  }
  if (grupo.length) grupos.push(grupo);

  return grupos.flatMap((items) => {
    const finales = [];
    const ubicadas = items.map((clase) => {
      let columna = finales.findIndex((fin) => fin <= clase.inicio);
      if (columna === -1) columna = finales.length;
      finales[columna] = clase.fin;
      return { ...clase, columna };
    });
    return ubicadas.map((clase) => ({ ...clase, columnas: finales.length }));
  });
}

export default function HorarioSemanal({ cursos = [], startHour = 8, endHour = 19 }) {
  const [seleccion, setSeleccion] = useState(null);
  const horarios = cursos.flatMap((curso) => (curso.horarios ?? []).map((horario) => ({ curso, horario })));
  const clases = horarios.flatMap(({ curso, horario }) => {
    const dia = DIAS.find((item) => normalizarDia(item) === normalizarDia(horario.dia));
    const inicio = minutos(horario.hora_inicio);
    const fin = minutos(horario.hora_termino);
    if (!dia || inicio === null || fin === null || fin <= inicio) return [];
    return [{ curso, horario, dia, inicio, fin }];
  });
  const dias = DIAS.filter((dia, index) => index < 5 || clases.some((clase) => clase.dia === dia));
  const primeraHora = Math.min(startHour, ...clases.map((clase) => Math.floor(clase.inicio / 60)));
  const ultimaHora = Math.max(endHour, ...clases.map((clase) => Math.ceil(clase.fin / 60)));
  const horas = Array.from({ length: ultimaHora - primeraHora }, (_, index) => primeraHora + index);
  const altura = horas.length * ALTURA_HORA;
  const omitidos = horarios.length - clases.length;

  return (
    <>
      {horarios.length === 0 && <p className="mb-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">No tienes horarios registrados por ahora.</p>}
      {omitidos > 0 && <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800" role="alert">Algunos horarios no se pudieron mostrar porque contienen días u horas no válidos. Contacta al administrador.</p>}
      <section aria-label="Horario semanal" className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="min-w-[872px]">
          <div className="grid bg-slate-50" style={{ gridTemplateColumns: `72px repeat(${dias.length}, minmax(160px, 1fr))` }}>
            <div className="h-11 border-b border-r border-slate-200" />
            {dias.map((dia) => <div className="flex h-11 items-center justify-center border-b border-r border-slate-200 px-3 text-sm font-semibold text-slate-700 last:border-r-0" key={dia}>{dia}</div>)}
          </div>
          <div className="grid" style={{ gridTemplateColumns: `72px repeat(${dias.length}, minmax(160px, 1fr))` }}>
            <div className="bg-slate-50">
              {horas.map((hora) => <div className="h-[72px] border-b border-r border-slate-200 px-3 pt-3 text-sm font-semibold text-slate-500" key={hora}>{String(hora).padStart(2, "0")}:00</div>)}
            </div>
            {dias.map((dia) => (
              <div className="relative border-r border-slate-200 last:border-r-0" key={dia} style={{ height: altura }}>
                {horas.map((hora) => <div aria-hidden="true" className="h-[72px] border-b border-slate-200" key={hora} />)}
                {distribuirClases(clases.filter((clase) => clase.dia === dia)).map((clase) => (
                  <div className="absolute p-1" key={clase.horario.horario_id} style={{ top: ((clase.inicio - primeraHora * 60) / 60) * ALTURA_HORA, height: ((clase.fin - clase.inicio) / 60) * ALTURA_HORA, left: `${(clase.columna / clase.columnas) * 100}%`, width: `${100 / clase.columnas}%` }}>
                    <button className="flex h-full w-full flex-col overflow-y-auto rounded-xl border border-blue-200 bg-blue-50 p-2 text-left text-[#091581] transition hover:border-[#091581] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-[#091581]" onClick={() => setSeleccion(clase)} type="button">
                      <span className="text-sm font-bold leading-5">{clase.curso.nombre_curso}</span>
                      <span className="mt-1 text-xs text-blue-800">NRC {clase.curso.nrc}</span>
                      <span className="mt-auto pt-1 text-xs font-semibold">{clase.horario.hora_inicio.slice(0, 5)} – {clase.horario.hora_termino.slice(0, 5)}</span>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
      {seleccion && <FormularioEstudiante actividad={{ horario_id: seleccion.horario.horario_id, curso: seleccion.curso.nombre_curso, nrc: seleccion.curso.nrc, horario: `${seleccion.dia} · ${seleccion.horario.hora_inicio.slice(0, 5)} – ${seleccion.horario.hora_termino.slice(0, 5)}` }} onClose={() => setSeleccion(null)} />}
    </>
  );
}
