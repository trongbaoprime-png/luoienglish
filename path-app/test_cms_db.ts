import { cmsDb, crmDb } from "./src/lib/db";

async function testIsolatedDbs() {
  console.log("Testing LƯỚI CMS DB (luoi-cms.db)...");
  const shortcodes = await cmsDb.shortcodeBlock.findMany();
  console.log("--> CMS Shortcodes Count:", shortcodes.length);
  console.log("--> CMS Shortcodes Keys:", shortcodes.map(s => s.key));

  const posts = await cmsDb.post.findMany();
  console.log("--> CMS Posts Count:", posts.length);

  const media = await cmsDb.media.findMany();
  console.log("--> CMS Media Count:", media.length);

  console.log("\nTesting miniCRM DB (minicrm.db)...");
  const leads = await crmDb.cRMLead.findMany({ take: 5 });
  console.log("--> CRM Leads Sample Count:", leads.length);

  process.exit(0);
}

testIsolatedDbs();
