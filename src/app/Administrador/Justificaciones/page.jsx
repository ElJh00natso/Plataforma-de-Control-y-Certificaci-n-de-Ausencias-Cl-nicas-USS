import { redirect } from "next/navigation";
import { getCurrentSession } from "../../../lib/auth/currentSession";
import ListaJustificaciones from "../../../components/Administrador/ListaJustificaciones";

export default async function JustificacionesPage() {
  const sesion = await getCurrentSession();
  if (!sesion || !["administrador", "estudiante"].includes(sesion.role)) redirect("/");

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-7 sm:py-10">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#091581]">Justificaciones clínicas</p>
      <h1 className="mt-2 text-2xl font-bold text-slate-800 sm:text-3xl">Justificaciones recientes</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">Consulta las solicitudes de justificación enviadas recientemente.</p>
      {sesion.role === "administrador" ? <ListaJustificaciones /> : <p className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">Esta sección estará disponible próximamente.</p>}
    </main>
  );
}
