# LƯỜI ENGLISH — AI Workspace Constitution

> **STATUS**: IMMUTABLE FOR ALL AI AGENTS & CONTRIBUTORS  
> **REPO**: `luoienglish`  
> **MASCOT**: CHÚ LƯỜI (Sloth) — *STRICTLY NO DINOSAURS / DINO BRANDING*  
> **HARNESS**: LƯỜI OS Agent Engineering Harness v1 (`LOS-001`)

---

## 1. Core Invariants

1. **Brand Integrity**:
   - The mascot is **Chú Lười** (a gentle, clever sloth).
   - Never copy DinoEnglish branding, assets, or layout verbatim.
   - Dino / Dinosaur is strictly excluded from our product IP.
2. **Pedagogical Integrity**:
   - Content is structured as data (never hardcoded into JSX).
   - Knowledge items follow Bloom/acquisition stages: recognize → recall → understand → use → produce → transfer.
   - Spaced Repetition and Active Recall drive memory mastery, not just lesson click-throughs.
3. **Architectural Integrity**:
   - Modular Monolith in Next.js + Strict TypeScript.
   - UI components MUST NOT directly import Firebase SDK or external AI SDKs. All persistence and AI flow through typed repositories and services.
   - Theme changes (`cozy` vs `explorer`) MUST NOT alter business logic, APIs, or database schemas.
4. **Safety & Ethics**:
   - Zero public child profiles, zero stranger communication, zero predatory monetization.
   - Server-trusted reward calculation (anti-cheat by design).
   - Server-side AI Gateway with strict child safety prompts and scaffolded hints.
5. **Engineering Harness & Definition of Done v2**:
   - Every task follows the **10-Step Definition of Done Pipeline** (`ai-workspace/workflows/DEFINITION_OF_DONE.md`).
   - Every task must pass: Strict Typecheck, Lint, Tests, Red Team Review, and Build before completion.
   - Institutional memory must be consulted (`ai-workspace/memory/`) and updated (`LESSON_EXTRACTOR.md`).
   - Atomic commits only. Never refactor unrelated files without task authorization.
