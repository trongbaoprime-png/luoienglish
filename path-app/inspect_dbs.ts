import { PrismaClient } from "@prisma/client";
import { PrismaClient as CMSClient } from "@prisma/client-cms";

async function inspect() {
  const defaultClient = new PrismaClient({
    datasources: { db: { url: "file:./prisma/dev.db" } },
  });
  
  const minicrmClient = new PrismaClient({
    datasources: { db: { url: "file:./prisma/minicrm.db" } },
  });

  try {
    const scDev = await defaultClient.shortcodeBlock.findMany();
    console.log("dev.db Shortcodes count:", scDev.length);
  } catch (e: any) {
    console.log("dev.db Shortcodes error:", e.message);
  }

  try {
    const scCrm = await minicrmClient.shortcodeBlock.findMany();
    console.log("minicrm.db Shortcodes count:", scCrm.length);
    if (scCrm.length > 0) {
      console.log("minicrm.db Shortcodes keys:", scCrm.map(s => s.key));
    }
  } catch (e: any) {
    console.log("minicrm.db Shortcodes error:", e.message);
  }

  try {
    const mediaCrm = await minicrmClient.media.findMany();
    console.log("minicrm.db Media count:", mediaCrm.length);
  } catch (e: any) {
    console.log("minicrm.db Media error:", e.message);
  }

  try {
    const settingsCrm = await minicrmClient.setting.findMany();
    console.log("minicrm.db Settings count:", settingsCrm.length);
  } catch (e: any) {
    console.log("minicrm.db Settings error:", e.message);
  }

  process.exit(0);
}

inspect();
