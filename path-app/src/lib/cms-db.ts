import { PrismaClient as CMSPrismaClient } from "@prisma/client-cms";

const globalForCMS = globalThis as unknown as {
  cmsDb: CMSPrismaClient | undefined;
};

export const cmsDb =
  globalForCMS.cmsDb ??
  new CMSPrismaClient({
    datasources: {
      db: {
        url: process.env.CMS_DATABASE_URL || "file:./prisma/luoi-cms.db",
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForCMS.cmsDb = cmsDb;
}
