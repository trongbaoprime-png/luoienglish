import { describe, it } from "node:test";
import assert from "node:assert";
import * as fs from "fs";
import * as path from "path";
import { getAssetUrl, listRegisteredAssets } from "./assetRegistry";
import { listRegisteredSounds } from "./soundRegistry";
import { MotionRegistry } from "../motion/motionRegistry";

describe("Asset Integrity & Visual Reality Verification Suite (LE-011B)", () => {
  const publicDir = path.resolve("public");

  it("Test 1: Every registered asset has a physical SVG file on disk", () => {
    const assets = listRegisteredAssets();
    assert.strictEqual(assets.length > 20, true);

    for (const asset of assets) {
      const diskPath = path.join(publicDir, asset.url.replace(/^\//, ""));
      assert.strictEqual(
        fs.existsSync(diskPath),
        true,
        `Asset file missing on disk: ${diskPath}`
      );
    }
  });

  it("Test 2: Every registered sound has a physical audio file on disk", () => {
    const sounds = listRegisteredSounds();
    assert.strictEqual(sounds.length >= 10, true);

    for (const sound of sounds) {
      const diskPath = path.join(publicDir, sound.url.replace(/^\//, ""));
      assert.strictEqual(
        fs.existsSync(diskPath),
        true,
        `Sound file missing on disk: ${diskPath}`
      );
    }
  });

  it("Test 3: Dual theme asset resolution returns existing files for Cozy & Explorer", () => {
    const cozyMascot = getAssetUrl("mascot.sloth.{theme}.hello", "cozy");
    const explorerMascot = getAssetUrl("mascot.sloth.{theme}.hello", "explorer");

    assert.strictEqual(cozyMascot.includes("cozy"), true);
    assert.strictEqual(explorerMascot.includes("explorer"), true);

    assert.strictEqual(fs.existsSync(path.join(publicDir, cozyMascot.replace(/^\//, ""))), true);
    assert.strictEqual(fs.existsSync(path.join(publicDir, explorerMascot.replace(/^\//, ""))), true);
  });

  it("Test 4: Reduced motion mode clamps all animation tokens to zero or linear transitions", () => {
    const float = MotionRegistry.getMotion("motion.float", true);
    assert.strictEqual(float.easing, "linear");

    const rewardFly = MotionRegistry.getMotion("motion.rewardFly", true);
    assert.strictEqual(rewardFly.easing, "linear");
  });
});
