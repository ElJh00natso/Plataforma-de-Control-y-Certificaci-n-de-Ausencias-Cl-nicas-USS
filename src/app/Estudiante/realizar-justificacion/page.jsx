import HorarioSemanal from "../../../components/schedule/HorarioSemanal";

const demoSchedules = [
  {
    id: "adulto-1-lunes",
    day: "Lunes",
    startTime: "08:00",
    endTime: "10:00",
    course: "Clínica Integral del Adulto I",
    nrc: "24561",
    type: "Actividad clínica",
    variant: "blue",
  },
  {
    id: "nino-martes",
    day: "Martes",
    startTime: "10:00",
    endTime: "12:00",
    course: "Clínica del Niño y Adolescente I",
    nrc: "24573",
    type: "Actividad clínica",
    variant: "teal",
  },
  {
    id: "adulto-1-miercoles",
    day: "Miércoles",
    startTime: "14:00",
    endTime: "16:00",
    course: "Clínica Integral del Adulto I",
    nrc: "24561",
    type: "Actividad clínica",
    variant: "blue",
  },
  {
    id: "rehabilitacion-jueves",
    day: "Jueves",
    startTime: "16:00",
    endTime: "18:00",
    course: "Clínica de Rehabilitación Oral I",
    nrc: "24589",
    type: "Actividad clínica",
    variant: "violet",
  },
];

const timeSlots = ["08:00", "10:00", "12:00", "14:00", "16:00"];

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

      <HorarioSemanal schedules={demoSchedules} timeSlots={timeSlots} />
    </main>
  );
}
