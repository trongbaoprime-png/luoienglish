# LƯỜI ENGLISH — Production Asset Pipeline & Curation Workflow

> **Asset Invariant**: "Placeholder UI is NOT Production Visual."  
> All assets progress through a rigorous verification pipeline before being flagged as `PRODUCTION`.

---

## 1. Asset Creation & Promotion Workflow

```
1. Art Direction & Brief
   ↓
2. Character Bible & Style Specification
   ↓
3. Handcrafted SVG Vector / Audio Design / High-res render
   ↓
4. Editorial Curation & Child Safety Review
   ↓
5. Optimization (SVGO, WebP conversion, Opus compression)
   ↓
6. Semantic ID Assignment & Manifest Registration (`public/manifests/production-assets.json`)
   ↓
7. Visual QA Verification (/dev/assets, /dev/audio, /dev/visual-qa)
   ↓
8. Production Release (`status: "PRODUCTION"`)
```

---

## 2. Asset Classification Taxonomy

- `PRODUCTION`: Handcrafted, verified SVGs/WebP/MP3 assets meeting all visual & acoustic standards.
- `PROVISIONAL`: Functionally validated vector art / sound effects pending final studio remastering.
- `PLACEHOLDER`: Clean vector/CSS fallbacks ensuring the app never breaks or shows missing textures.
- `MISSING`: Known asset IDs currently rendered through the 4-tier fallback hierarchy.
