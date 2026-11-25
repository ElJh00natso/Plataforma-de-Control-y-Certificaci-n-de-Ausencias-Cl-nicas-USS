"use client";

import Image from "next/image";
import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const ContextoCarga = createContext(null);

export function LoadingScreenTime({ mensaje = "Cargando tu espacio…" }) {
  return (
    <div aria-live="polite" className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-white px-6" role="status">
      <Image alt="Universidad San Sebastián" className="h-auto w-56 max-w-full sm:w-64" height={120} priority src="/images/logos/uss.webp" width={300} />
      <span aria-hidden="true" className="h-10 w-10 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#091581] motion-reduce:animate-none" />
      <span className="text-sm font-medium text-slate-600">{mensaje}</span>
    </div>
  );
}

export function LoadingScreenProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [carga, setCarga] = useState(null);

  useEffect(() => {
    if (!carga) return;
    // La pantalla se oculta después de llegar; el plazo mayor evita bloquear la interfaz.
    const timer = window.setTimeout(() => setCarga(null), pathname === carga.destino ? 600 : 15000);
    return () => window.clearTimeout(timer);
  }, [carga, pathname]);

  function navegar({ destino, mensaje = "Cargando tu espacio…" }) {
    setCarga({ destino, mensaje });
    router.push(destino);
  }

  return (
    <ContextoCarga.Provider value={{ navegar, enCurso: carga !== null }}>
      {children}
      {carga && <LoadingScreenTime mensaje={carga.mensaje} />}
    </ContextoCarga.Provider>
  );
}

export function useLoadingScreenTime() {
  const contexto = useContext(ContextoCarga);
  if (!contexto) throw new Error("La pantalla de carga no está disponible.");
  return contexto;
}
