import TarjetaHorario from "./TarjetaHorario";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default function HorarioSemanal({ schedules, timeSlots }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] border-collapse text-left">
          <thead className="bg-slate-50 text-sm font-semibold text-slate-700">
            <tr>
              <th className="w-24 border-b border-r border-slate-200 px-4 py-4" scope="col">Hora</th>
              {days.map((day) => (
                <th className="border-b border-slate-200 px-4 py-4 text-center" key={day} scope="col">{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time) => (
              <tr key={time}>
                <th className="border-b border-r border-slate-200 bg-slate-50 px-4 py-5 align-top text-sm font-semibold text-slate-500" scope="row">{time}</th>
                {days.map((day) => {
                  const classes = schedules.filter((schedule) => schedule.day === day && schedule.startTime === time);

                  return (
                    <td className="min-h-32 border-b border-r border-slate-200 p-2 align-top last:border-r-0" key={`${day}-${time}`}>
                      {classes.map((schedule) => (
                        <TarjetaHorario
                          course={schedule.course}
                          endTime={schedule.endTime}
                          key={schedule.id}
                          nrc={schedule.nrc}
                          startTime={schedule.startTime}
                          type={schedule.type}
                          variant={schedule.variant}
                        />
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
