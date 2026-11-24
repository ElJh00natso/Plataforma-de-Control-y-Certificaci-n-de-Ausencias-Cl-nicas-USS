import HorarioSemanal from "../../../components/schedule/HorarioSemanal";

export default function RealizarJustificacionPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-7 sm:px-7 sm:py-10">
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#091581]">Actividades clínicas</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Realizar justificación</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Selecciona una actividad clínica asociada a tu NRC para iniciar una solicitud de justificación.
        </p>
      </div>

      <HorarioSemanal />
    </main>
  );
}
