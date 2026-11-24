export default function HistorialPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.12em] text-[#315d8f]">ESTUDIANTE</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#00264c]">Mis justificaciones</h1>
        </div>
        <p className="text-sm text-slate-500">Solicitudes enviadas</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead className="border-b border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
              <tr>
                <th className="px-4 py-4">Folio</th>
                <th className="px-4 py-4">Curso</th>
                <th className="px-4 py-4">Fecha de clase</th>
                <th className="px-4 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="text-base text-slate-600">
              <tr>
                <td className="px-4 py-12 text-center" colSpan="4">
                  Aún no hay solicitudes para mostrar.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
