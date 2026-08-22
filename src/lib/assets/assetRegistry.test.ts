import { describe, it } from "node:test";
import assert from "node:assert";
import {
  getAssetUrl,
  getAssetMetadata,
  listRegisteredAssets,
  ASSET_REGISTRY,
} from "./assetRegistry";

describe("AssetRegistry & 4-Tier Fallback Hierarchy (LE-011)", () => {
  it("Test 1: Resolves registered semantic asset correctly", () => {
    const url = getAssetUrl("reward.star");
    assert.strictEqual(url, "/assets/rewards/star.svg");

    const meta = getAssetMetadata("reward.star");
    assert.strictEqual(meta?.status, "PRODUCTION");
    assert.strictEqual(meta?.category, "reward");
  });

  it("Test 2: Resolves theme-interpolated asset ID", () => {
    const cozyUrl = getAssetUrl("world.{theme}.treehouse", "cozy");
    assert.strictEqual(cozyUrl, "/assets/worlds/cozy_treehouse.svg");
  });

  it("Test 3: Gracefully provides fallback URL on unknown or missing asset", () => {
    const unknownUrl = getAssetUrl("world.unknown.castle");
    assert.strictEqual(unknownUrl, "/assets/placeholders/world_unknown_castle.svg");
  });

  it("Test 4: Exposes full list of registered assets for inspector tools", () => {
    const assets = listRegisteredAssets();
    assert.strictEqual(assets.length > 20, true);
    assert.strictEqual(Object.keys(ASSET_REGISTRY).length, assets.length);
  });
});
