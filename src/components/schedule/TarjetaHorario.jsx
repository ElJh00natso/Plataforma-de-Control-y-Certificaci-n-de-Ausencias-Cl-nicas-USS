const stylesByVariant = {
  blue: "border-blue-100 bg-blue-50 text-blue-950",
  teal: "border-teal-100 bg-teal-50 text-teal-950",
  violet: "border-violet-100 bg-violet-50 text-violet-950",
};

export default function TarjetaHorario({ course, endTime, nrc, startTime, type, variant = "blue" }) {
  return (
    <article className={`h-full rounded-xl border p-3 ${stylesByVariant[variant] ?? stylesByVariant.blue}`}>
      <p className="text-sm font-bold leading-5">{course}</p>
      <p className="mt-1 text-sm font-medium opacity-75">NRC {nrc}</p>
      <p className="mt-3 text-sm font-semibold">{startTime} – {endTime}</p>
      <p className="mt-1 text-sm opacity-75">{type}</p>
    </article>
  );
}
