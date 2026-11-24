import Image from "next/image";
import LoginForm from "../components/auth/LoginForm";

export default function HomePage() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-slate-950 font-sans">
      <Image
        alt="Clínica de la Facultad de Odontología USS"
        className="hidden object-cover object-[62%_center] md:block"
        fill
        priority
        sizes="100vw"
        src="/images/auth/atencion-odontologica.webp"
      />
      <div className="absolute inset-0 hidden bg-[#0b2746]/28 md:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#071b31]/88 via-[#0b2746]/58 to-[#0b2746]/18 md:block" />

      <section className="relative z-10 mx-auto grid min-h-svh w-full max-w-[1320px] items-center gap-12 px-5 py-8 md:grid-cols-[minmax(0,420px)_1fr] md:px-10 md:py-12 lg:gap-20">
        <section className="w-full max-w-[420px] rounded-[1.65rem] bg-white p-7 shadow-2xl shadow-slate-950/35 sm:p-9">
          <div className="mb-7 flex justify-center">
            <Image
              alt="Universidad San Sebastián"
              className="h-auto w-[175px] object-contain"
              height={80}
              priority
              src="/images/logos/uss.webp"
              width={190}
            />
          </div>

          <div className="mb-7 text-center">
            <p className="text-sm font-medium text-slate-500">Acceso institucional</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Iniciar sesión</h1>
            <p className="mt-2 text-sm leading-5 text-slate-500">Ingresa con tus credenciales institucionales.</p>
          </div>

          <LoginForm />
        </section>

        <div className="hidden max-w-xl self-center text-white md:block">
          <p className="mb-4 text-sm font-semibold tracking-[0.22em] text-white/80">FACULTAD DE ODONTOLOGÍA</p>
          <h2 className="text-4xl font-bold tracking-tight drop-shadow-sm lg:text-5xl">Justificación de inasistencias</h2>
          <p className="mt-5 max-w-lg text-lg leading-7 text-white/95 drop-shadow-sm">
            Gestiona tus solicitudes de justificación para actividades clínicas de forma simple, segura y centralizada.
          </p>
          <div className="mt-8 h-px w-20 bg-[#c9a55a]" />
          <p className="mt-5 text-xl font-medium text-white drop-shadow-sm">Sistema de apoyo académico USS</p>
        </div>
      </section>
    </main>
  );
}
