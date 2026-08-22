import { describe, it } from "node:test";
import assert from "node:assert";
import { AssetManifestValidator } from "./manifestValidator";

describe("AssetManifestValidator & Integrity Suite (LE-011B)", () => {
  it("Test 1: Manifest exists and passes all physical file validation", () => {
    const report = AssetManifestValidator.validate();
    if (!report.isValid) {
      console.error("Manifest validation errors:", report.errors);
    }
    assert.strictEqual(report.isValid, true, `Validation failed: ${report.errors.join("; ")}`);
    assert.strictEqual(report.totalAssets > 20, true);
    assert.strictEqual(report.errors.length, 0);
  });

  it("Test 2: PRODUCTION and PROVISIONAL assets have valid physical files on disk", () => {
    const report = AssetManifestValidator.validate();
    assert.strictEqual(report.counts.production >= 4, true);
    assert.strictEqual(report.counts.provisional >= 15, true);
    assert.strictEqual(report.counts.missing, 0);
  });
});
