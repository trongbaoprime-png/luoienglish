import * as fs from "fs";
import * as path from "path";
import puppeteer from "puppeteer-core";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const EXECUTABLE_PATH = fs.existsSync(CHROME_PATH) ? CHROME_PATH : EDGE_PATH;
const PORT = process.env.PORT || "3008";

const ARTIFACT_SCREENSHOTS_DIR = path.resolve(
  "C:/Users/AD/.gemini/antigravity-ide/brain/77c31c68-ace1-4834-827b-b318aaca0337/screenshots"
);
const PUBLIC_SCREENSHOTS_DIR = path.resolve("public/screenshots");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function capture() {
  console.log(`Using Browser executable: ${EXECUTABLE_PATH}`);
  console.log(`Target Port: http://localhost:${PORT}`);
  ensureDir(ARTIFACT_SCREENSHOTS_DIR);
  ensureDir(PUBLIC_SCREENSHOTS_DIR);

  const browser = await puppeteer.launch({
    executablePath: EXECUTABLE_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--hide-scrollbars"],
  });

  const viewports = [
    { name: "mobile_390x844", width: 390, height: 844 },
    { name: "tablet_768x1024", width: 768, height: 1024 },
  ];

  const screens = [
    { name: "home_3d", path: "/home" },
    { name: "adventure_map_3d", path: "/adventure-map" },
    { name: "lesson_player_3d", path: "/learn/lesson_g3_u1_l1" },
    { name: "talk_to_luoi_3d", path: "/talk-to-luoi" },
    { name: "story_reader_3d", path: "/story-world" },
    { name: "game_zone_3d", path: "/game-land" },
    { name: "pet_world_3d", path: "/pet" },
    { name: "media_world_3d", path: "/media-world" },
  ];

  for (const vp of viewports) {
    for (const screen of screens) {
      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });

      const targetUrl = `http://localhost:${PORT}${screen.path}`;
      console.log(`Capturing [${vp.name}] ${targetUrl}...`);

      try {
        await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 20000 });
        await new Promise((r) => setTimeout(r, 1200));

        const filename = `${screen.name}_${vp.name}.png`;
        const artifactPath = path.join(ARTIFACT_SCREENSHOTS_DIR, filename);
        const publicPath = path.join(PUBLIC_SCREENSHOTS_DIR, filename);

        await page.screenshot({ path: artifactPath, fullPage: false });
        await page.screenshot({ path: publicPath, fullPage: false });

        console.log(`✓ Saved: ${filename}`);
      } catch (err) {
        console.error(`Error capturing ${screen.name}:`, err);
      } finally {
        await page.close();
      }
    }
  }

  await browser.close();
  console.log("All 3D Master Design screenshots captured successfully!");
}

capture().catch((err) => {
  console.error("Screenshot capture failed:", err);
  process.exit(1);
});
