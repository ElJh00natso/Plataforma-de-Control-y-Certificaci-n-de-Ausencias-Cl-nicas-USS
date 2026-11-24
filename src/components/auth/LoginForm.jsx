"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function handleSubmit(event) {
    event.preventDefault();
    router.push("/Estudiante");
  }

  return (
    <form className="w-full space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 ml-1 block text-sm font-semibold text-slate-800" htmlFor="rut">
          RUT
        </label>
        <div className="group relative">
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 transition-colors group-focus-within:text-[#091581]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 7a3 3 0 11-6 0 3 3 0 016 0zM5.5 20a6.5 6.5 0 0113 0M4 4h16v16H4z" />
            </svg>
          </span>
          <input
            autoComplete="username"
            className="h-12 w-full rounded-xl border border-slate-200 bg-[#f4f7fb] pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#091581] focus:ring-4 focus:ring-[#e8eef8]"
            id="rut"
            name="rut"
            placeholder="12.345.678-9"
            type="text"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 ml-1 block text-sm font-semibold text-slate-800" htmlFor="password">
          Contraseña
        </label>
        <div className="group relative">
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500 transition-colors group-focus-within:text-[#091581]">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 10V7a5 5 0 0110 0v3m-11 0h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2zm5 4v3" />
            </svg>
          </span>
          <input
            autoComplete="current-password"
            className="h-12 w-full rounded-xl border border-slate-200 bg-[#f4f7fb] pl-12 pr-12 text-sm font-medium text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-[#091581] focus:ring-4 focus:ring-[#e8eef8]"
            id="password"
            name="password"
            placeholder="Ingresa tu contraseña"
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 transition-colors hover:text-[#091581] focus-visible:outline-2 focus-visible:outline-[#091581]"
            onClick={() => setShowPassword((value) => !value)}
            type="button"
          >
            {showPassword ? (
              <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.2A10.8 10.8 0 0112 5c5 0 8.5 4.2 9.5 7-.4 1.1-1.2 2.3-2.3 3.3M6.2 6.2C4.3 7.5 3.1 9.4 2.5 12c1 2.8 4.5 7 9.5 7 1 0 1.9-.2 2.7-.5" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
                <circle cx="12" cy="12" r="2.5" strokeWidth="1.8" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <button
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#091581] px-4 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-[#091581]/15 transition hover:bg-[#060e5e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#091581] active:scale-[0.99]"
        type="submit"
      >
        Ingresar
        <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-6-6 6 6-6 6" />
        </svg>
      </button>

      <p className="text-center text-xs leading-5 text-slate-500">
        Demo visual: el acceso aún no procesa credenciales.
      </p>
    </form>
  );
}
