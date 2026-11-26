"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar({ homeHref = "/", sections = [], title = "Justificaciones clínicas" }) {
  const pathname = usePathname();
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState("");

  async function cerrarSesion() {
    setCerrando(true);
    setError("");
    try {
      const respuesta = await fetch("/api/usuario/cerrar-sesion", { method: "POST" });
      if (!respuesta.ok) throw new Error("No se pudo cerrar la sesión.");
      window.location.assign("/");
    } catch {
      setError("No se pudo cerrar la sesión. Inténtalo nuevamente.");
      setCerrando(false);
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-5 px-5 py-3 sm:px-7 md:min-h-16 md:flex-nowrap md:py-2">
        <Link aria-label="Ir al inicio" className="flex shrink-0 items-center" href={homeHref}>
          <Image alt="Universidad San Sebastián" className="h-9 w-auto object-contain" height={54} priority src="/images/logos/uss.webp" width={180} />
        </Link>

        <nav aria-label={title} className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-slate-100 pt-2 md:order-2 md:w-auto md:border-0 md:pt-0">
          {sections.map((section) => {
            const active = pathname === section.href;

            return (
              <Link
                className={`whitespace-nowrap border-b-2 px-2 py-2 text-sm font-medium transition sm:px-3 ${active ? "border-[#091581] text-[#091581]" : "border-transparent text-slate-500 hover:text-slate-800"}`}
                href={section.href}
                key={section.href}
              >
                {section.title}
              </Link>
            );
          })}
        </nav>

        <div className="order-2 shrink-0 text-right md:order-3">
          <button type="button" onClick={cerrarSesion} disabled={cerrando} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-[#091581] transition hover:bg-[#e8eef8] disabled:opacity-60">{cerrando ? "Cerrando…" : "Cerrar sesión"}</button>
          {error && <p role="alert" className="mt-1 text-xs text-rose-700">{error}</p>}
        </div>
      </div>
    </header>
  );
}
