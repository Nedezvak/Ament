import { PrismaClient } from "@prisma/client";

// Singleton pattern: reuse one Prisma connection in development
// to avoid exhausting connection pool on hot-reload.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
