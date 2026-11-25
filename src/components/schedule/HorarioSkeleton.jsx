const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default function HorarioSkeleton({ startHour = 8, endHour = 19 }) {
  const horas = Array.from({ length: endHour - startHour }, (_, index) => startHour + index);

  return (
    <section aria-busy="true" aria-label="Cargando horario" className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm" role="status">
      <span className="sr-only">Cargando horario…</span>
      <table aria-hidden="true" className="w-full min-w-[872px] animate-pulse border-collapse motion-reduce:animate-none">
        <colgroup>
          <col className="w-[72px]" />
          {dias.map((dia) => <col className="w-[160px]" key={dia} />)}
        </colgroup>
        <thead className="bg-slate-50">
          <tr>
            <th className="h-11 border-b border-r border-slate-200" />
            {dias.map((dia) => <th className="h-11 border-b border-r border-slate-200 px-3 last:border-r-0" key={dia}><div className="mx-auto h-3 w-16 rounded-full bg-slate-200" /></th>)}
          </tr>
        </thead>
        <tbody>
          {horas.map((hora) => (
            <tr key={hora}>
              <th className="h-[72px] border-b border-r border-slate-200 bg-slate-50 px-3"><div className="h-2.5 w-10 rounded-full bg-slate-200" /></th>
              {dias.map((dia) => <td className="h-[72px] border-b border-r border-slate-200 bg-slate-50/60 last:border-r-0" key={`${dia}-${hora}`} />)}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
