import Link from "next/link";

export default function EstudiantePage() {
  const summary = [
    { label: "Aprobadas", value: 0, color: "bg-emerald-500" },
    { label: "En revisión", value: 0, color: "bg-amber-500" },
    { label: "Rechazadas", value: 0, color: "bg-red-500" },
  ];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-7 sm:px-7 sm:py-10">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#162d5c] via-[#091581] to-[#243ea5] px-6 py-8 text-white shadow-xl shadow-[#091581]/15 sm:px-10 sm:py-11 lg:px-12">
        <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -right-6 -top-14 -z-10 h-56 w-56 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -bottom-32 right-28 -z-10 h-64 w-64 rounded-full bg-white/[0.06] blur-2xl" />
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            Justificaciones Clínicas · Odontología USS
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">Bienvenido/a, estudiante</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">
            Presenta tus solicitudes de justificación y consulta el estado de tus inasistencias en actividades clínicas.
          </p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute bottom-8 right-12 hidden h-36 w-36 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] lg:flex">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/90">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 21c-1.2 0-1.5-1-2.2-3.5-.5-1.8-1.1-2.5-2.3-2.5S5.3 16.2 4.8 18C4.1 20.5 3.8 21 3 21c-1.2 0-1.8-2.2-1.8-5.5C1.2 8.8 4.7 4 9 4c1.2 0 2.1.4 3 1.1C12.9 4.4 13.8 4 15 4c4.3 0 7.8 4.8 7.8 11.5 0 3.3-.6 5.5-1.8 5.5-.8 0-1.1-.5-1.8-3-.5-1.8-1.5-3-2.7-3s-1.8.7-2.3 2.5C13.5 20 13.2 21 12 21Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
              <path d="M9 9h.01M15 9h.01" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
            </svg>
          </div>
        </div>
      </section>

      <section aria-labelledby="student-actions">
        <div className="mb-4">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#091581]">Acciones principales</p>
          <h2 className="mt-1 text-xl font-bold text-slate-800 sm:text-2xl" id="student-actions">¿Qué necesitas hacer hoy?</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Link className="group relative flex min-h-52 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#091581]/40 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#091581] sm:p-7" href="/Estudiante/realizar-justificacion">
            <div aria-hidden="true" className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#e8eef8] transition-transform duration-300 group-hover:scale-110" />
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8eef8] text-[#091581]">
              <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6.75 3.75h11.5A1.75 1.75 0 0 1 20 5.5v14.75H7.25A2.25 2.25 0 0 1 5 18V5.5a1.75 1.75 0 0 1 1.75-1.75Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                <path d="M8.5 3.75v16.5M12 8h4.5M12 11.5h4.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
              </svg>
            </div>
            <div className="relative mt-5">
              <h3 className="text-lg font-bold text-slate-800 transition group-hover:text-[#091581]">Realizar justificación</h3>
              <p className="mt-1.5 max-w-md text-sm leading-6 text-slate-500">Revisa tus actividades clínicas disponibles y selecciona la clase que necesitas justificar.</p>
            </div>
          </Link>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#091581]">Resumen</p>
            <h3 className="mt-1 text-lg font-bold text-slate-800">Tus justificaciones</h3>
            <div aria-label="Gráfico de estados de justificaciones" className="mt-6 space-y-4" role="img">
              {summary.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-800">{item.value}</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">Los estados se mostrarán cuando existan solicitudes registradas.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
