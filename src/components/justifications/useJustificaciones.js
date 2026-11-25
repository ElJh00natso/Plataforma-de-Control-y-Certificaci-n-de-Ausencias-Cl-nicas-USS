"use client";

import { useEffect, useState } from "react";

export function useJustificaciones() {
  const [estado, setEstado] = useState({ cargando: true, error: "", justificaciones: [] });
  const [revision, setRevision] = useState(0);

  function actualizar() {
    setEstado((actual) => ({ ...actual, cargando: true, error: "" }));
    setRevision((actual) => actual + 1);
  }

  useEffect(() => {
    const controller = new AbortController();
    async function cargar() {
      try {
        const respuesta = await fetch("/api/Estudiante/justificaciones", { signal: controller.signal, cache: "no-store" });
        const datos = await respuesta.json();
        if (!respuesta.ok) throw new Error(datos.message || "No fue posible consultar tus justificaciones.");
        if (!Array.isArray(datos.justificaciones)) throw new Error("La respuesta recibida no es válida.");
        setEstado({ cargando: false, error: "", justificaciones: datos.justificaciones });
      } catch (error) {
        if (error.name !== "AbortError") setEstado({ cargando: false, error: error.message || "Error de conexión.", justificaciones: [] });
      }
    }
    cargar();
    return () => controller.abort();
  }, [revision]);

  return { ...estado, actualizar };
}

// Centraliza los nombres reconocidos sin tratar estados desconocidos como aprobados o rechazados.
export function clasificarEstado(estado) {
  const valor = String(estado ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[\s-]+/g, "_");
  if (["aprobada", "aprobado", "aceptada", "aceptado"].includes(valor)) return "aprobadas";
  if (["rechazada", "rechazado"].includes(valor)) return "rechazadas";
  if (["en_revision", "pendiente", "recibida", "recibido"].includes(valor)) return "en_revision";
  return "otros";
}
