"use client";

import { useState } from "react";
import FormularioEstudiante from "../justifications/FormularioEstudiante";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export default function HorarioSemanal({ endHour = 19, startHour = 8 }) {
  const hours = Array.from({ length: endHour - startHour }, (_, index) => startHour + index);
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[872px] border-collapse text-left">
        <colgroup>
          <col className="w-[72px]" />
          {days.map((day) => <col className="w-[160px]" key={day} />)}
        </colgroup>
        <thead className="bg-slate-50">
          <tr>
            <th className="h-11 border-b border-r border-slate-200" scope="col" />
            {days.map((day) => (
              <th className="h-11 border-b border-r border-slate-200 px-3 text-center text-sm font-semibold text-slate-700 last:border-r-0" key={day} scope="col">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <th className="h-[72px] border-b border-r border-slate-200 bg-slate-50 px-3 align-top pt-3 text-sm font-semibold text-slate-500" scope="row">
                {String(hour).padStart(2, "0")}:00
              </th>
              {days.map((day) => {
                const isAdultClinic = day === "Lunes" && hour === 9;
                const isCoveredByAdultClinic = day === "Lunes" && (hour === 10 || hour === 11);

                if (isCoveredByAdultClinic) return null;

                if (isAdultClinic) {
                  return (
                    <td className="border-b border-r border-slate-200 p-1.5 align-top" colSpan={1} rowSpan={3} key={`${day}-${hour}`}>
                      <button
                        className="flex h-full min-h-[204px] w-full flex-col rounded-xl border border-blue-200 bg-blue-50 p-3 text-left text-[#091581] transition hover:border-[#091581] hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-[#091581] focus:ring-offset-2"
                        onClick={() => setShowForm(true)}
                        type="button"
                      >
                        <p className="text-sm font-bold leading-5">Clínica Integral del Adulto I</p>
                        <p className="mt-1 text-xs font-medium text-blue-800">NRC 24561</p>
                        <p className="mt-auto pt-3 text-sm font-semibold">09:00 – 12:00</p>
                        <p className="mt-1 text-xs text-slate-600">Actividad clínica</p>
                      </button>
                    </td>
                  );
                }

                return <td className="h-[72px] border-b border-r border-slate-200 last:border-r-0" key={`${day}-${hour}`} />;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <FormularioEstudiante
          actividad={{
            curso: "Clínica Integral del Adulto I",
            horario: "Lunes · 09:00 – 12:00",
            nrc: "24561",
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </section>
  );
}
