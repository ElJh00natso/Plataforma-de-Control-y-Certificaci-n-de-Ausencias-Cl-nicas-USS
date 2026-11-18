import "./globals.css";

export const metadata = {
  title: "Justificaciones Clínicas | Odontología USS",
  description: "Sistema de justificación de inasistencias clínicas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
