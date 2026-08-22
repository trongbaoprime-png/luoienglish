import * as fs from "fs";
import * as path from "path";

export interface AssetManifestEntry {
  id: string;
  category: "character" | "world" | "ui" | "reward" | "pet" | "icon" | "scene" | "fx";
  theme?: "cozy" | "explorer" | "universal";
  ageProfile?: string;
  state?: string;
  file: string;
  fallback?: string;
  dimensions?: string;
  aspectRatio?: string;
  format?: string;
  preload?: boolean;
  animated?: boolean;
  audioEvent?: string;
  status: "PRODUCTION" | "PROVISIONAL" | "PLACEHOLDER" | "MISSING";
}

export interface AssetManifest {
  version: string;
  generatedAt: string;
  assets: AssetManifestEntry[];
}

export interface ValidationReport {
  isValid: boolean;
  totalAssets: number;
  counts: {
    production: number;
    provisional: number;
    placeholder: number;
    missing: number;
  };
  errors: string[];
  warnings: string[];
}

export class AssetManifestValidator {
  /**
   * Validates manifest integrity against physical files on disk
   */
  public static validate(
    manifestPath = path.resolve("public/manifests/production-assets.json"),
    publicRoot = path.resolve("public")
  ): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!fs.existsSync(manifestPath)) {
      return {
        isValid: false,
        totalAssets: 0,
        counts: { production: 0, provisional: 0, placeholder: 0, missing: 0 },
        errors: [`Manifest file not found: ${manifestPath}`],
        warnings: [],
      };
    }

    let manifest: AssetManifest;
    try {
      const raw = fs.readFileSync(manifestPath, "utf-8");
      manifest = JSON.parse(raw) as AssetManifest;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return {
        isValid: false,
        totalAssets: 0,
        counts: { production: 0, provisional: 0, placeholder: 0, missing: 0 },
        errors: [`Invalid JSON in manifest: ${msg}`],
        warnings: [],
      };
    }

    const counts = {
      production: 0,
      provisional: 0,
      placeholder: 0,
      missing: 0,
    };

    const validCategories = ["character", "world", "ui", "reward", "pet", "icon", "scene", "fx"];
    const validStatuses = ["PRODUCTION", "PROVISIONAL", "PLACEHOLDER", "MISSING"];

    for (const asset of manifest.assets) {
      // 1. Status count
      if (!validStatuses.includes(asset.status)) {
        errors.push(`Asset [${asset.id}] has invalid status: ${asset.status}`);
      } else if (asset.status === "PRODUCTION") {
        counts.production++;
      } else if (asset.status === "PROVISIONAL") {
        counts.provisional++;
      } else if (asset.status === "PLACEHOLDER") {
        counts.placeholder++;
      } else if (asset.status === "MISSING") {
        counts.missing++;
      }

      // 2. Category check
      if (!validCategories.includes(asset.category)) {
        errors.push(`Asset [${asset.id}] has invalid category: ${asset.category}`);
      }

      // 3. Primary file existence check
      const primaryDiskPath = path.join(publicRoot, asset.file.replace(/^\//, ""));
      const primaryExists = fs.existsSync(primaryDiskPath);

      if (!primaryExists) {
        if (asset.status === "PRODUCTION" || asset.status === "PROVISIONAL") {
          errors.push(
            `Primary file missing for ${asset.status} asset [${asset.id}]: ${asset.file}`
          );
        } else {
          warnings.push(`Primary file does not exist for [${asset.id}]: ${asset.file}`);
        }
      }

      // 4. Fallback file existence check
      if (asset.fallback) {
        const fallbackDiskPath = path.join(publicRoot, asset.fallback.replace(/^\//, ""));
        if (!fs.existsSync(fallbackDiskPath)) {
          errors.push(
            `Declared fallback file missing for asset [${asset.id}]: ${asset.fallback}`
          );
        }
      }

      // 5. Dimensions metadata validity
      if (asset.dimensions && !/^\d+x\d+$/.test(asset.dimensions)) {
        errors.push(`Asset [${asset.id}] has invalid dimensions format: ${asset.dimensions}`);
      }
    }

    return {
      isValid: errors.length === 0,
      totalAssets: manifest.assets.length,
      counts,
      errors,
      warnings,
    };
  }
}
