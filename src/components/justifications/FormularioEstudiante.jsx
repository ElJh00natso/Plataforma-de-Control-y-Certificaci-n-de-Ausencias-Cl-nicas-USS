"use client";

export default function FormularioEstudiante({ onClose }) {
  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div aria-labelledby="student-form-title" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm" role="dialog">
      <div className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-[#091581]">Justificaciones clínicas · Odontología USS</p>
            <h2 className="mt-1 text-xl font-bold text-slate-800" id="student-form-title">Nueva justificación</h2>
          </div>
          <button aria-label="Cerrar formulario" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 text-[#091581] transition hover:bg-[#e8eef8]" onClick={onClose} type="button">
            <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        <form className="min-h-0 flex-1 space-y-6 overflow-y-auto p-5 sm:p-7" onSubmit={handleSubmit}>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="border-b border-slate-100 pb-3 text-base font-bold text-[#091581]">Datos del estudiante</h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="student-name">Nombre</label>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#091581] focus:ring-2 focus:ring-[#091581]/15" id="student-name" name="student-name" placeholder="Ingresa tu nombre" type="text" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="student-lastname">Apellido</label>
                <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#091581] focus:ring-2 focus:ring-[#091581]/15" id="student-lastname" name="student-lastname" placeholder="Ingresa tu apellido" type="text" />
              </div>
            </div>
          </section>

          <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
            Este es un primer prototipo visual. Aquí se incorporarán los campos de la justificación de inasistencia.
          </p>

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            <button className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100" onClick={onClose} type="button">
              Cancelar
            </button>
            <button className="rounded-xl bg-[#091581] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#060e5e]" type="submit">
              Continuar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
