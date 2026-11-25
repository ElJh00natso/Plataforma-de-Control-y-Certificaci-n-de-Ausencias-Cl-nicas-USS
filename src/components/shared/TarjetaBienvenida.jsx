export default function TarjetaBienvenida({ nombre, apellido, descripcion }) {
  const nombreCompleto = [nombre, apellido].filter(Boolean).join(" ");

  return (
    <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#162d5c] via-[#091581] to-[#243ea5] px-6 py-8 text-white shadow-xl shadow-[#091581]/15 sm:px-10 sm:py-11 lg:px-12">
      <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 h-80 w-80 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -right-6 -top-14 -z-10 h-56 w-56 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute -bottom-32 right-28 -z-10 h-64 w-64 rounded-full bg-white/[0.06] blur-2xl" />
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky-300" />
          Justificaciones Clínicas · Odontología USS
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem]">Bienvenido/a{nombreCompleto ? `, ${nombreCompleto}` : ""}</h1>
        {descripcion && <p className="mt-4 max-w-xl text-base leading-7 text-blue-100">{descripcion}</p>}
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
  );
}
