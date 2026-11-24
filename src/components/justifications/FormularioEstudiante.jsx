"use client";

import { useState } from "react";

const MEGABYTE = 1024 * 1024;
const allowedCertificateExtensions = ["pdf", "ppt", "pptx", "jpg", "jpeg", "png", "webp"];

function getExtension(fileName) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function DocumentIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7 text-[#091581]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V8Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 16V4m0 0L7 9m5-5 5 5M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function FormularioEstudiante({ onClose }) {
  const [certificate, setCertificate] = useState(null);
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function selectFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = getExtension(file.name);
    if (!allowedCertificateExtensions.includes(extension)) {
      setError("El tipo de archivo seleccionado no está permitido.");
      event.target.value = "";
      return;
    }

    if (file.size > 100 * MEGABYTE) {
      setError("El archivo supera el límite de 100 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setCertificate(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!certificate) {
      setError("Debes adjuntar un certificado médico o licencia médica.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("certificado", certificate);
      formData.append("comentarios", additionalDetails);

      const response = await fetch("/api/justificaciones", { body: formData, method: "POST" });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "No fue posible enviar la justificación.");

      setSuccess("Documento y antecedentes enviados correctamente a REDCap.");
    } catch (submissionError) {
      setError(submissionError.message || "Ocurrió un error al enviar la justificación.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div aria-labelledby="student-form-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog">
      <div className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#091581]">Justificaciones clínicas · Odontología USS</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800" id="student-form-title">Documentos de justificación</h2>
          </div>
          <button aria-label="Cerrar formulario" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-[#091581] transition hover:bg-[#e8eef8]" onClick={onClose} type="button">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <form className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-7" onSubmit={handleSubmit}>
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white shadow-sm"><DocumentIcon /></span>
              <div>
                <h3 className="text-lg font-bold text-[#091581]">Documentos de justificación</h3>
                <p className="mt-2 text-sm leading-6 text-slate-700">A continuación, agrega los documentos que respalden tu inasistencia.</p>
              </div>
            </div>
            <ul className="mt-5 space-y-2 border-t border-blue-100 pt-5 text-sm leading-6 text-slate-700">
              <li>• Solo se aceptarán certificados médicos, licencias médicas y/o justificaciones emitidas por tribunales de justicia.</li>
              <li>• El documento debe indicar explícitamente el nombre y RUT del alumno, la causa y el período de justificación.</li>
              <li>• Debe incluir la firma y timbre de quien suscribe el documento.</li>
              <li>• La fotografía o escaneo debe corresponder al documento original, a color. No se aceptarán fotocopias.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <label className="text-base font-bold leading-6 text-slate-800" htmlFor="medical-certificate">Adjunte certificado médico y/o licencia médica</label>
            <p className="mt-1 text-sm text-slate-500">Máximo un archivo.</p>
            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 px-4 py-4 text-sm font-semibold text-[#091581] transition hover:border-[#091581] hover:bg-blue-100" htmlFor="medical-certificate">
              <UploadIcon />
              Cargar archivo
            </label>
            <input accept=".pdf,.ppt,.pptx,image/*" className="sr-only" id="medical-certificate" onChange={selectFile} type="file" />
            {certificate && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">Archivo seleccionado: {certificate.name}</p>}
            <p className="mt-3 text-xs leading-5 text-slate-500">Límite: 1 archivo · Tamaño máximo: 100 MB · Formatos permitidos: PPT, PDF e imagen.</p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <label className="text-base font-bold text-slate-800" htmlFor="additional-details">Antecedentes adicionales</label>
            <p className="mt-1 text-sm text-slate-500">Si lo necesitas, agrega información complementaria para evaluar tu solicitud.</p>
            <textarea className="mt-4 min-h-32 w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#091581] focus:ring-2 focus:ring-[#091581]/15" id="additional-details" name="additional-details" onChange={(event) => setAdditionalDetails(event.target.value)} placeholder="Escribe aquí información adicional…" value={additionalDetails} />
          </section>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">{error}</p>}
          {success && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800" role="status">{success}</p>}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            <button className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100" disabled={isSubmitting} onClick={onClose} type="button">Cancelar</button>
            <button className="rounded-xl bg-[#091581] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#060e5e] disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Enviando…" : "Enviar justificación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
