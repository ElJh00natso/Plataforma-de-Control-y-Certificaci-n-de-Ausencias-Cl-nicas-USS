-- CreateTable
CREATE TABLE "Usuario" (
    "usuario_id" SERIAL NOT NULL,
    "rut" TEXT NOT NULL,
    "pass_hash" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Estudiante" (
    "usuario_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Docente" (
    "usuario_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Administrador" (
    "usuario_id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,

    CONSTRAINT "Administrador_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "Curso" (
    "curso_id" SERIAL NOT NULL,
    "docente_id" INTEGER NOT NULL,
    "nombre_curso" TEXT NOT NULL,
    "nrc" TEXT NOT NULL,
    "seccion" TEXT,

    CONSTRAINT "Curso_pkey" PRIMARY KEY ("curso_id")
);

-- CreateTable
CREATE TABLE "Curso_por_estudiante" (
    "curso_estudiante_id" SERIAL NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "curso_id" INTEGER NOT NULL,

    CONSTRAINT "Curso_por_estudiante_pkey" PRIMARY KEY ("curso_estudiante_id")
);

-- CreateTable
CREATE TABLE "Horario" (
    "horario_id" SERIAL NOT NULL,
    "curso_id" INTEGER NOT NULL,
    "hora_inicio" TIME(0) NOT NULL,
    "hora_termino" TIME(0) NOT NULL,
    "dia" TEXT NOT NULL,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("horario_id")
);

-- CreateTable
CREATE TABLE "Justificaciones" (
    "justificacion_id" SERIAL NOT NULL,
    "horario_id" INTEGER NOT NULL,
    "estudiante_id" INTEGER NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,

    CONSTRAINT "Justificaciones_pkey" PRIMARY KEY ("justificacion_id")
);

-- CreateTable
CREATE TABLE "push_suscription" (
    "push_id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "push_suscription_pkey" PRIMARY KEY ("push_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_rut_key" ON "Usuario"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "Curso_por_estudiante_estudiante_id_curso_id_key" ON "Curso_por_estudiante"("estudiante_id", "curso_id");

-- CreateIndex
CREATE UNIQUE INDEX "push_suscription_endpoint_key" ON "push_suscription"("endpoint");

-- AddForeignKey
ALTER TABLE "Estudiante" ADD CONSTRAINT "Estudiante_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Docente" ADD CONSTRAINT "Docente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrador" ADD CONSTRAINT "Administrador_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso" ADD CONSTRAINT "Curso_docente_id_fkey" FOREIGN KEY ("docente_id") REFERENCES "Docente"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso_por_estudiante" ADD CONSTRAINT "Curso_por_estudiante_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "Estudiante"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Curso_por_estudiante" ADD CONSTRAINT "Curso_por_estudiante_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Curso"("curso_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_curso_id_fkey" FOREIGN KEY ("curso_id") REFERENCES "Curso"("curso_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Justificaciones" ADD CONSTRAINT "Justificaciones_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "Horario"("horario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Justificaciones" ADD CONSTRAINT "Justificaciones_estudiante_id_fkey" FOREIGN KEY ("estudiante_id") REFERENCES "Estudiante"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "push_suscription" ADD CONSTRAINT "push_suscription_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;
