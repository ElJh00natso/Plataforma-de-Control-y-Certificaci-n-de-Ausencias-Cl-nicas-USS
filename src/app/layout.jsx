import "./globals.css";
import { LoadingScreenProvider } from "../components/shared/LoadingScreenTime";

export const metadata = {
  title: "Justificaciones Clínicas | Odontología USS",
  description: "Sistema de justificación de inasistencias clínicas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body><LoadingScreenProvider>{children}</LoadingScreenProvider></body>
    </html>
  );
}
