"use client";

import { useEffect, useRef, useState } from "react";

// El resumen llega por props; los antecedentes se consultan en REDCap al abrir.
export default function ModalJustificacion({ justificacion, onClose }) {
  const dialogo = useRef(null);
  const [detalle, setDetalle] = useState(null);
  const [estado, setEstado] = useState(justificacion.redcapId ? "cargando" : "ejemplo");
  const [descargando, setDescargando] = useState(false);
  const [errorDescarga, setErrorDescarga] = useState("");

  useEffect(() => {
    const elemento = dialogo.current;
    elemento.showModal();
    return () => elemento.close();
  }, []);

  useEffect(() => {
    if (!justificacion.redcapId) return;
    const controller = new AbortController();
    async function consultarRedcap() {
      try {
        const respuesta = await fetch("/api/Administrador/redcap", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ redcapId: justificacion.redcapId }), signal: controller.signal, cache: "no-store" });
        if (!respuesta.ok) throw new Error("No se pudo consultar REDCap.");
        setDetalle(await respuesta.json());
        setEstado("listo");
      } catch (error) {
        if (error.name !== "AbortError") setEstado("error");
      }
    }
    consultarRedcap();
    return () => controller.abort();
  }, [justificacion.redcapId]);

  async function descargarCertificado() {
    setDescargando(true);
    setErrorDescarga("");
    try {
      const respuesta = await fetch("/api/Administrador/redcap/certificado", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ redcapId: justificacion.redcapId }), cache: "no-store" });
      if (!respuesta.ok) throw new Error("No fue posible descargar el certificado.");
      const blob = await respuesta.blob();
      const url = URL.createObjectURL(blob);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = respuesta.headers.get("Content-Disposition")?.match(/filename="([^"]+)"/)?.[1] || "certificado";
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setErrorDescarga("No fue posible descargar el certificado. Inténtalo nuevamente.");
    } finally {
      setDescargando(false);
    }
  }

  return (
    <dialog ref={dialogo} onCancel={(event) => { event.preventDefault(); onClose(); }} aria-labelledby="detalle-justificacion-titulo" className="m-auto max-h-[92dvh] w-[calc(100%-2rem)] max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-950/60">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-7">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#091581]">Justificaciones clínicas · Odontología USS</p>
          <h2 id="detalle-justificacion-titulo" className="mt-1 text-xl font-bold text-slate-800">Detalle de justificación</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar detalle" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-xl text-[#091581] hover:bg-[#e8eef8]">×</button>
      </header>
      <div className="max-h-[calc(92dvh-6rem)] space-y-5 overflow-y-auto p-5 sm:p-7">
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-bold text-[#091581]">Actividad seleccionada · {justificacion.id}</p>
          <p className="mt-1 font-semibold text-slate-800">{justificacion.curso}</p>
          <p className="mt-1 text-sm text-slate-600">NRC {justificacion.nrc} · Prof. {justificacion.docente}</p>
          <p className="mt-2 text-sm text-slate-600">Estudiante: {justificacion.estudiante}</p>
          <p className="mt-1 text-sm text-slate-600">Estado: {justificacion.texto}</p>
        </section>
        <section className="rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h3 className="text-base font-bold text-slate-800">Certificado o documento de respaldo</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{estado === "ejemplo" ? "El ejemplo no tiene un documento asociado." : "Descarga el documento adjunto a esta solicitud desde REDCap."}</p>
          {justificacion.redcapId && <button type="button" onClick={descargarCertificado} disabled={descargando} className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-[#091581] hover:bg-blue-100 disabled:opacity-60">{descargando ? "Descargando…" : "Descargar certificado"}</button>}
          {errorDescarga && <p role="alert" className="mt-3 text-sm text-rose-700">{errorDescarga}</p>}
        </section>
        <section className="rounded-2xl border border-slate-200 p-5 sm:p-6">
          <h3 className="text-base font-bold text-slate-800">Antecedentes adicionales</h3>
          {estado === "cargando" ? <div role="status" aria-label="Cargando antecedentes" className="mt-4 animate-pulse space-y-3 motion-reduce:animate-none"><div aria-hidden="true" className="h-3 w-full rounded bg-slate-100" /><div aria-hidden="true" className="h-3 w-4/5 rounded bg-slate-100" /><div aria-hidden="true" className="h-3 w-2/3 rounded bg-slate-100" /><span className="sr-only">Cargando antecedentes desde REDCap…</span></div> : <p className="mt-2 whitespace-pre-wrap text-sm font-medium leading-6 text-slate-800">{estado === "error" ? "No fue posible consultar REDCap." : estado === "ejemplo" ? "Vista de ejemplo sin datos de REDCap." : detalle.comentarios || "Sin antecedentes adicionales."}</p>}
        </section>
        {estado === "ejemplo" && <p className="text-xs text-slate-500">Vista de ejemplo sin conexión a REDCap.</p>}
        <div className="flex justify-end border-t border-slate-100 pt-5"><button type="button" onClick={onClose} className="rounded-xl bg-[#091581] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#060e5e]">Cerrar</button></div>
      </div>
    </dialog>
  );
}
