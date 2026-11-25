import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

function createPrismaClient() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL no está configurada.");
  // Prisma facilita las consultas; el adaptador usa pg para conectarse a PostgreSQL.
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 1 });
  return new PrismaClient({ adapter });
}

// En desarrollo reutilizamos el cliente para evitar conexiones extra al recargar código.
const prisma = globalThis.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export default prisma;
