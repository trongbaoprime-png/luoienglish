import { db, cmsDb } from "./src/lib/db";

async function syncCmsData() {
  console.log("🚀 Starting LƯỚI CMS database isolation & sync...");

  try {
    // 1. Sync Categories
    const categories = await db.category.findMany();
    console.log(`Syncing ${categories.length} Categories...`);
    for (const cat of categories) {
      await cmsDb.category.upsert({
        where: { id: cat.id },
        update: cat,
        create: cat,
      });
    }

    // 2. Sync Media
    const mediaList = await db.media.findMany();
    console.log(`Syncing ${mediaList.length} Media items...`);
    for (const m of mediaList) {
      await cmsDb.media.upsert({
        where: { id: m.id },
        update: m,
        create: m,
      });
    }

    // 3. Sync Posts (Articles)
    const posts = await db.post.findMany();
    console.log(`Syncing ${posts.length} Posts...`);
    for (const p of posts) {
      await cmsDb.post.upsert({
        where: { id: p.id },
        update: p,
        create: p,
      });
    }

    // 4. Sync Pages
    const pages = await db.page.findMany();
    console.log(`Syncing ${pages.length} Pages...`);
    for (const pg of pages) {
      await cmsDb.page.upsert({
        where: { id: pg.id },
        update: pg,
        create: pg,
      });
    }

    // 5. Sync Shortcode Blocks
    const shortcodes = await db.shortcodeBlock.findMany();
    console.log(`Syncing ${shortcodes.length} Shortcode Blocks...`);
    for (const sc of shortcodes) {
      await cmsDb.shortcodeBlock.upsert({
        where: { id: sc.id },
        update: sc,
        create: sc,
      });
    }

    // 6. Sync Products
    const products = await db.product.findMany();
    console.log(`Syncing ${products.length} Products...`);
    for (const pr of products) {
      await cmsDb.product.upsert({
        where: { id: pr.id },
        update: pr,
        create: pr,
      });
    }

    // 7. Sync Settings
    const settings = await db.setting.findMany();
    console.log(`Syncing ${settings.length} Settings...`);
    for (const st of settings) {
      await cmsDb.setting.upsert({
        where: { key: st.key },
        update: st,
        create: st,
      });
    }

    console.log("✅ LƯỚI CMS Database Sync Complete!");
  } catch (error) {
    console.error("❌ Error syncing CMS data:", error);
  } finally {
    process.exit(0);
  }
}

syncCmsData();
