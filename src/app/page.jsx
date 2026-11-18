import Image from "next/image";
import LoginForm from "../components/auth/LoginForm";

export default function HomePage() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-slate-950 font-sans">
      <Image
        alt="Clínica de la Facultad de Odontología USS"
        className="hidden object-cover object-center md:block"
        fill
        priority
        sizes="100vw"
        src="/images/auth/odontologia-facultad-2.webp"
      />
      <div className="absolute inset-0 hidden bg-[#0b2746]/78 md:block" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#081c35]/58 via-[#0b2746]/22 to-[#081c35]/35 md:block" />

      <section className="relative z-10 mx-auto grid min-h-svh w-full max-w-[1320px] items-center gap-12 px-5 py-8 md:grid-cols-[1fr_400px] md:px-10 md:py-12 lg:grid-cols-[1fr_420px]">
        <div className="hidden max-w-2xl self-center text-white md:block">
          <p className="mb-4 text-sm font-semibold tracking-[0.22em] text-white/75">FACULTAD DE ODONTOLOGÍA</p>
          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">Justificación de inasistencias</h1>
          <p className="mt-5 max-w-xl text-lg leading-7 text-white/90">
            Gestiona tus solicitudes de justificación para actividades clínicas de forma simple, segura y centralizada.
          </p>
          <div className="mt-9 h-px w-20 bg-[#c9a55a]" />
          <p className="mt-5 text-xl font-medium text-white/95">Sistema de apoyo académico USS</p>
        </div>

        <section className="w-full rounded-[1.65rem] bg-white p-7 shadow-2xl shadow-slate-950/35 sm:p-9">
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
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-800">Iniciar sesión</h2>
            <p className="mt-2 text-sm leading-5 text-slate-500">Ingresa con tus credenciales institucionales.</p>
          </div>

          <LoginForm />
        </section>
      </section>
    </main>
  );
}
