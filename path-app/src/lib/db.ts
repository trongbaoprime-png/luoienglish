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

// 1. Default DB (Master DB - dev.db)
export const db =
  globalForPrisma.prisma ??
  new DefaultPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 2. Dedicated LƯỚI CMS DB (prisma/luoi-cms.db - Isolated CMS Module)
export const cmsDb =
  globalForPrisma.cmsPrisma ??
  new CMSPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 3. Dedicated MINICRM DB (prisma/minicrm.db - Isolated CRM Module with 47,928 Leads)
export const crmDb =
  globalForPrisma.crmPrisma ??
  new CRMPrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// 4. Dedicated OMNICHANNEL DB (prisma/omnichannel.db - Isolated Omnichannel Module)
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
