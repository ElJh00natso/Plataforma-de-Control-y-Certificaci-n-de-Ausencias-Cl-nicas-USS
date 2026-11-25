"use client";

import { clasificarEstado, useJustificaciones } from "./useJustificaciones";

export default function ResumenJustificaciones() {
  const { cargando, error, justificaciones, actualizar } = useJustificaciones();
  const conteo = { aprobadas: 0, en_revision: 0, rechazadas: 0, otros: 0 };
  for (const item of justificaciones) conteo[clasificarEstado(item.estado)]++;
  const filas = [
    { clave: "aprobadas", titulo: "Aprobadas", color: "bg-emerald-500" },
    { clave: "en_revision", titulo: "En revisión", color: "bg-amber-500" },
    { clave: "rechazadas", titulo: "Rechazadas", color: "bg-red-500" },
    ...(conteo.otros ? [{ clave: "otros", titulo: "Otros estados", color: "bg-slate-500" }] : []),
  ];

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#091581]">Resumen</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="mt-1 text-lg font-bold text-slate-800">Tus justificaciones</h3>
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#091581] hover:bg-slate-50 disabled:opacity-50" disabled={cargando} onClick={actualizar} type="button">Actualizar</button>
      </div>
      {cargando ? <p className="mt-6 text-sm text-slate-500" role="status">Cargando resumen…</p> : error ? (
        <p className="mt-6 text-sm text-red-700" role="alert">{error}</p>
      ) : (
        <>
          <div aria-label="Cantidad de justificaciones por estado" className="mt-6 space-y-4">
            {filas.map((fila) => {
              const valor = conteo[fila.clave];
              const porcentaje = justificaciones.length ? valor / justificaciones.length * 100 : 0;
              return <div key={fila.clave}>
                <div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-slate-600">{fila.titulo}</span><span className="font-bold text-slate-800">{valor}</span></div>
                <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${fila.color}`} style={{ width: `${porcentaje}%` }} /></div>
              </div>;
            })}
          </div>
          <p className="mt-5 text-sm text-slate-500">{justificaciones.length ? `Total: ${justificaciones.length} ${justificaciones.length === 1 ? "solicitud" : "solicitudes"}.` : "Aún no tienes solicitudes registradas."}</p>
        </>
      )}
    </article>
  );
}
