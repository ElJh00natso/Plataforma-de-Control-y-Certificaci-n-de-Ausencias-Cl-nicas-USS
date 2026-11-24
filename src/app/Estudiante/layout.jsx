import Navbar from "../../components/shared/Navbar";

const studentSections = [
  { title: "Inicio", href: "/Estudiante" },
  { title: "Realizar justificación", href: "/Estudiante/realizar-justificacion" },
  { title: "Mis justificaciones", href: "/Estudiante/historial" },
];

export default function StudentLayout({ children }) {
  return (
    <div className="min-h-svh bg-[#f8fafc] text-slate-800">
      <Navbar homeHref="/Estudiante" sections={studentSections} title="Justificaciones clínicas" />
      {children}
    </div>
  );
}
