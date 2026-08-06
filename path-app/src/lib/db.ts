import { PrismaClient as DefaultPrismaClient } from "@prisma/client";
import { PrismaClient as CMSPrismaClient } from "@prisma/client-cms";
import { PrismaClient as CRMPrismaClient } from "@prisma/client-crm";
import { PrismaClient as OmniPrismaClient } from "@prisma/client-omni";

const globalForPrisma = globalThis as unknown as {
  prisma: DefaultPrismaClient | undefined;
  cmsPrisma: CMSPrismaClient | undefined;
  crmPrisma: CRMPrismaClient | undefined;
  omniPrisma: OmniPrismaClient | undefined;
};

// 1. Default DB (Full / Backward Compatible)
export const db =
  globalForPrisma.prisma ??
  new DefaultPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 2. Dedicated LƯỚI CMS DB (luoi-cms.db)
export const cmsDb =
  globalForPrisma.cmsPrisma ??
  new CMSPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 3. Dedicated MINICRM DB (minicrm.db)
export const crmDb =
  globalForPrisma.crmPrisma ??
  new CRMPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 4. Dedicated OMNICHANNEL DB (omnichannel.db - 500k customers & 60 Fanpages)
export const omnichannelDb =
  globalForPrisma.omniPrisma ??
  new OmniPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.cmsPrisma = cmsDb;
  globalForPrisma.crmPrisma = crmDb;
  globalForPrisma.omniPrisma = omnichannelDb;
}
