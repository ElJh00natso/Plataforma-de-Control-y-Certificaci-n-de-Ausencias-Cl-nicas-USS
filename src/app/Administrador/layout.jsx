import Navbar from "../../components/shared/Navbar";
import { getCurrentSession } from "../../lib/auth/currentSession";

export default async function AdministradorLayout({ children }) {
  const sesion = await getCurrentSession();
  const esEstudiante = sesion?.role === "estudiante";
  const sections = esEstudiante
    ? [
        { title: "Inicio", href: "/Estudiante" },
        { title: "Realizar justificación", href: "/Estudiante/realizar-justificacion" },
        { title: "Mis justificaciones", href: "/Estudiante/historial" },
        { title: "Justificaciones", href: "/Administrador/Justificaciones" },
      ]
    : [
        { title: "Inicio", href: "/Administrador" },
        { title: "Justificaciones", href: "/Administrador/Justificaciones" },
      ];
  return (
    <div className="min-h-svh bg-[#f8fafc] text-slate-800">
      <Navbar homeHref={esEstudiante ? "/Estudiante" : "/Administrador"} sections={sections} />
      {children}
    </div>
  );
}
