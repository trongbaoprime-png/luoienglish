# Task Contract: LE-001 — Repository & Foundation Bootstrap

- **Task ID**: `LE-001`
- **Goal**: Establish the complete Next.js 15+ repository topology, AI workspace, strict domain types, theme system, semantic registries, sample curriculum, memory & reward engines, and validation pipeline for LƯỜI ENGLISH.
- **Risk Level**: `R2 Data/Architecture`
- **Context Required**: `docs/architecture/ARCHITECTURE.md`, `PLAN.md`, `CHARACTER_BIBLE.md`
- **Files Allowed**: Root config files, `docs/`, `ai-workspace/`, `src/`, `public/`
- **Files Forbidden**: Unrelated files from other projects
- **Acceptance Criteria**:
  1. Next.js app bootstrapped with Strict TypeScript and Tailwind CSS.
  2. Complete `ai-workspace/` directory with Constitution, State, Context, Rules, Skills, Workflows, Tasks, and ADRs.
  3. Strict types in `src/types/`.
  4. Pure domain engines for Memory & Reward in `src/engines/`.
  5. Pluggable Repositories in `src/repositories/`.
  6. Sample Grade 3 "Hello & Friends" curriculum data seed in `src/content/`.
  7. Semantic asset and audio registries.
  8. Typecheck, Lint, and Build succeed with 0 errors.
- **Validation Commands**: `npm run typecheck && npm run lint && npm run build`
- **Rollback Point**: Git commit before bootstrap.
