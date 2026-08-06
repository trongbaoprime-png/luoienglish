import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

function findDbFiles(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === "node_modules" || file === ".next" || file === ".git") continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findDbFiles(fullPath));
    } else if (file.endsWith(".db")) {
      results.push(fullPath);
    }
  }
  return results;
}

async function checkAllDbs() {
  const root = process.cwd();
  const dbFiles = findDbFiles(root);
  console.log("Found .db files:", dbFiles);

  for (const dbFile of dbFiles) {
    const size = fs.statSync(dbFile).size;
    console.log(`\n-----------------------------------`);
    console.log(`Testing DB: ${dbFile} (Size: ${size} bytes)`);
    try {
      const client = new PrismaClient({
        datasources: { db: { url: `file:${dbFile}` } },
      });
      
      try {
        const posts = await client.post.findMany();
        console.log(`  -> Posts count: ${posts.length}`);
      } catch (e) {}

      try {
        const pages = await client.page.findMany();
        console.log(`  -> Pages count: ${pages.length}`);
      } catch (e) {}

      try {
        const shortcodes = await client.shortcodeBlock.findMany();
        console.log(`  -> Shortcodes count: ${shortcodes.length}`);
        if (shortcodes.length > 0) {
          console.log(`     Keys:`, shortcodes.map(s => s.key));
        }
      } catch (e) {}

      try {
        const media = await client.media.findMany();
        console.log(`  -> Media count: ${media.length}`);
      } catch (e) {}

      try {
        const leads = await client.cRMLead.findMany();
        console.log(`  -> CRMLeads count: ${leads.length}`);
      } catch (e) {}

      try {
        const settings = await client.setting.findMany();
        console.log(`  -> Settings count: ${settings.length}`);
      } catch (e) {}

      await client.$disconnect();
    } catch (err: any) {
      console.log(`  -> Error: ${err.message}`);
    }
  }
}

checkAllDbs();
