"use client";

import { useEffect, useState } from "react";

// Convierte la clave pública VAPID al formato binario que espera PushManager.
function convertirClave(clave) {
  const base64 = clave.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(clave.length / 4) * 4, "=");
  return Uint8Array.from(atob(base64), (caracter) => caracter.charCodeAt(0));
}

export default function PermisoNotificaciones() {
  const [estado, setEstado] = useState("comprobando");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window) || !window.isSecureContext) {
      setEstado("no_disponible");
      return;
    }
    setEstado(Notification.permission === "granted" ? "pendiente" : Notification.permission);
  }, []);

  async function solicitarPermiso() {
    try {
      // El permiso se solicita solo después de que el usuario pulse el botón.
      const permiso = await Notification.requestPermission();
      if (permiso !== "granted") { setEstado(permiso); return; }
      setEstado("registrando");
      await navigator.serviceWorker.register("/service-worker.js");
      const registro = await navigator.serviceWorker.ready;
      const clave = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!clave) throw new Error("Falta la clave pública VAPID.");
      // Reutilizamos la suscripción del navegador, o creamos una si no existe.
      const suscripcion = await registro.pushManager.getSubscription() || await registro.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: convertirClave(clave) });
      // El servidor obtiene el usuario de la cookie, nunca del navegador.
      const respuesta = await fetch("/api/usuario/suscripciones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(suscripcion.toJSON()) });
      if (!respuesta.ok) throw new Error("No se pudo guardar la suscripción.");
      setEstado("suscrito");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "comprobando") return null;
  return (
    <section aria-labelledby="notificaciones-titulo" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 id="notificaciones-titulo" className="text-lg font-bold text-slate-800">Notificaciones</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">¿Quieres recibir notificaciones en este dispositivo?</p>
      {(estado === "default" || estado === "error" || estado === "pendiente") && <button type="button" onClick={solicitarPermiso} className="mt-4 rounded-xl bg-[#091581] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#060e5e]">Activar notificaciones</button>}
      {estado === "registrando" && <p role="status" className="mt-4 text-sm text-slate-600">Preparando el dispositivo…</p>}
      {estado === "suscrito" && <p role="status" className="mt-4 text-sm font-semibold text-emerald-700">Este dispositivo quedó suscrito a las notificaciones.</p>}
      {estado === "denied" && <p role="status" className="mt-4 text-sm text-rose-700">Las notificaciones están bloqueadas. Puedes habilitarlas en la configuración del navegador.</p>}
      {estado === "no_disponible" && <p role="status" className="mt-4 text-sm text-slate-600">Las notificaciones requieren un navegador compatible y una conexión segura (HTTPS o localhost).</p>}
      {estado === "error" && <p role="alert" className="mt-3 text-sm text-rose-700">No fue posible preparar el dispositivo. Inténtalo nuevamente.</p>}
    </section>
  );
}
