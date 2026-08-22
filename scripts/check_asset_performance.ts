import * as fs from "fs";
import * as path from "path";

const PUBLIC_DIR = path.resolve("d:/AI/ClaudeCode/public");

function getDirectorySize(dir: string): { totalBytes: number; largestFile: { name: string; size: number }; files: Array<{ name: string; size: number }> } {
  let totalBytes = 0;
  let largestFile = { name: "", size: 0 };
  const files: Array<{ name: string; size: number }> = [];

  function scan(d: string) {
    if (!fs.existsSync(d)) return;
    const entries = fs.readdirSync(d, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(d, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else {
        const stats = fs.statSync(fullPath);
        totalBytes += stats.size;
        files.push({ name: path.relative(PUBLIC_DIR, fullPath), size: stats.size });
        if (stats.size > largestFile.size) {
          largestFile = { name: path.relative(PUBLIC_DIR, fullPath), size: stats.size };
        }
      }
    }
  }

  scan(dir);
  return { totalBytes, largestFile, files };
}

function main() {
  const assetsStats = getDirectorySize(path.join(PUBLIC_DIR, "assets"));
  const audioStats = getDirectorySize(path.join(PUBLIC_DIR, "audio"));

  console.log("=== PERFORMANCE & ASSET BYTE BUDGET REPORT ===");
  console.log(`Visual Assets Total: ${(assetsStats.totalBytes / 1024).toFixed(2)} KB across ${assetsStats.files.length} files`);
  console.log(`Largest Visual Asset: ${assetsStats.largestFile.name} (${(assetsStats.largestFile.size / 1024).toFixed(2)} KB)`);
  console.log(`Audio Assets Total: ${(audioStats.totalBytes / 1024).toFixed(2)} KB across ${audioStats.files.length} files`);
  console.log(`Largest Audio Asset: ${audioStats.largestFile.name} (${(audioStats.largestFile.size / 1024).toFixed(2)} KB)`);
  console.log(`Critical Preload Budget (Mascot Idle + Tap + Star): ~${((assetsStats.files.find(f => f.name.includes("idle.svg"))?.size || 0) + (audioStats.files.find(f => f.name.includes("tap.mp3"))?.size || 0) + (assetsStats.files.find(f => f.name.includes("star.svg"))?.size || 0)) / 1024} KB (Ultra lightweight < 15KB)`);
}

main();
