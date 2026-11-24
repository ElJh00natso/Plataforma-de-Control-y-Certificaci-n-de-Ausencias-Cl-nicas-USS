"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ homeHref = "/", sections = [], title = "Justificaciones clínicas" }) {
  const pathname = usePathname();

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

        <p className="order-2 shrink-0 text-sm font-medium text-slate-500 md:order-3">{title}</p>
      </div>
    </header>
  );
}
