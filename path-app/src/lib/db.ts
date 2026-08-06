import { PrismaClient as DefaultPrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: DefaultPrismaClient | undefined;
};

// 1. Master Single-File Unified Prisma Client (dev.db with 47,928 Leads & Full CMS Data)
export const db =
  globalForPrisma.prisma ??
  new DefaultPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 2. Map all sub-module DB instances to Master Client for 100% unified data access
export const cmsDb = (db as any);
export const crmDb = (db as any);
export const omnichannelDb = (db as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
