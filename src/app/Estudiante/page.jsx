import Link from "next/link";
import TarjetaBienvenida from "../../components/shared/TarjetaBienvenida";
import { getCurrentSession } from "../../lib/auth/currentSession";
import ResumenJustificaciones from "../../components/justifications/ResumenJustificaciones";

export default async function EstudiantePage() {
  const sesion = await getCurrentSession();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-7 sm:px-7 sm:py-10">
      <TarjetaBienvenida
        nombre={sesion?.nombre}
        apellido={sesion?.apellido}
        descripcion="Presenta tus solicitudes de justificación y consulta el estado de tus inasistencias en actividades clínicas."
      />

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

          <ResumenJustificaciones />
        </div>
      </section>
    </main>
  );
}
