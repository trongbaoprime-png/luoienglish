import { PrismaClient as OmniPrismaClient } from "@prisma/client-omni";

const globalForOmni = globalThis as unknown as {
  omniDb: OmniPrismaClient | undefined;
};

export const omniDb =
  globalForOmni.omniDb ??
  new OmniPrismaClient({
    datasources: {
      db: {
        url: process.env.OMNI_DATABASE_URL || "file:./prisma/omnichannel.db",
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

export const omnichannelDb = omniDb;

if (process.env.NODE_ENV !== "production") {
  globalForOmni.omniDb = omniDb;
}
