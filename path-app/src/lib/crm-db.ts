import { PrismaClient as CRMPrismaClient } from "@prisma/client-crm";

const globalForCRM = globalThis as unknown as {
  crmDb: CRMPrismaClient | undefined;
};

export const crmDb =
  globalForCRM.crmDb ??
  new CRMPrismaClient({
    datasources: {
      db: {
        url: process.env.CRM_DATABASE_URL || "file:./prisma/minicrm.db",
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForCRM.crmDb = crmDb;
}
