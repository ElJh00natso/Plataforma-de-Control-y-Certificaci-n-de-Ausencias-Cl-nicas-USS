// Recibe mensajes push y muestra una notificación en el dispositivo.
self.addEventListener("push", (event) => {
  let datos = {};
  try { datos = event.data?.json() ?? {}; } catch { datos = {}; }
  const titulo = typeof datos.title === "string" ? datos.title : "Justificaciones clínicas";
  const body = typeof datos.body === "string" ? datos.body : "Tienes una nueva notificación.";
  event.waitUntil(self.registration.showNotification(titulo, { body, icon: "/images/logos/uss.webp" }));
});

// Al seleccionar la notificación, abre la página principal de la plataforma.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
