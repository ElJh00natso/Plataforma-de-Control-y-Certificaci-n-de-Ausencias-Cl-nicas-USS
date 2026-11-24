// Solo para desarrollo local. Reemplazar por usuarios y contraseñas hasheadas
// obtenidos desde la base de datos cuando se implemente autenticación real.
const usuariosTemporales = [
  {
    rut: "111111111",
    nombre: "Sofía",
    apellido: "Martínez",
    password: "DemoEstudiante123!",
    role: "estudiante",
  },
  {
    rut: "222222222",
    nombre: "Daniel",
    apellido: "Rojas",
    password: "DemoDocente123!",
    role: "docente",
  },
  {
    rut: "333333333",
    nombre: "Camila",
    apellido: "Soto",
    password: "DemoAdmin123!",
    role: "administrador",
  },
];

function normalizarRut(rut) {
  return rut.replace(/[.\-\s]/g, "").toUpperCase();
}

export function validarCredencialesTemporales({ rut, password }) {
  const rutNormalizado = normalizarRut(rut);

  return usuariosTemporales.find((usuario) => (
    usuario.rut === rutNormalizado && usuario.password === password
  ));
}
