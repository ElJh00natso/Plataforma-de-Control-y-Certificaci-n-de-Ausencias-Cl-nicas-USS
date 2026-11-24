import Link from "next/link";

export default function SolicitudesPage() {
  return (
    <main className="grid min-h-svh place-items-center bg-[#f4f7fb] px-6 py-10 text-center">
      <section className="w-full max-w-lg rounded-[1.75rem] bg-white p-10 shadow-xl shadow-slate-900/10">
        <p className="text-sm font-semibold tracking-[0.16em] text-[#315d8f]">DEMO</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-800">Solicitudes de justificación</h1>
        <p className="mt-4 leading-7 text-slate-600">
          Esta será la siguiente pantalla del flujo. Aquí construiremos la selección de curso y clase clínica.
        </p>
        <Link
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#091581] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#060e5e]"
          href="/"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
