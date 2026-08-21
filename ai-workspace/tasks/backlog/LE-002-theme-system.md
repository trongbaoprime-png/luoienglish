# Task Contract: LE-002 — Child-Scoped Dual-Theme System Polish

- **Task ID**: `LE-002`
- **Goal**: Polish the dual-theme system (`cozy` vs `explorer`) ensuring that theme preference is strictly child-scoped (persisted per `childId` in profile and child-specific storage), avoiding global cross-profile pollution.
- **Risk Level**: `R1 Feature`
- **Context Required**: `docs/design/THEME_SYSTEM.md`, `ai-workspace/decisions/ADR-002-two-theme-architecture.md`
- **Files Allowed**: `src/lib/theme/`, `src/components/theme/`, `src/types/student.ts`, `src/types/theme.ts`
- **Files Forbidden**: Domain engine business formulas, curriculum data models, database schemas.

## Impact Analysis
- **Current State**: Theme is stored in a single global `localStorage.getItem("luoi_theme")`. If a parent has two children (e.g. child A likes Cozy, child B likes Explorer), switching accounts would overwrite each other's preferences.
- **Target State**:
  1. Theme is scoped to active `childId` (`luoi_theme_${childId}`).
  2. `ThemeProvider` accepts `activeChildId` and syncs theme state seamlessly.
  3. When an authenticated child switches theme, `IChildRepository.update(childId, { themePreference })` is invoked to persist to the backend profile.
  4. Fallback to `luoi_theme_guest` for unauthenticated demo sessions.
- **Acceptance Criteria**:
  1. Multi-child isolation: Child A and Child B maintain independent theme preferences.
  2. Zero coupling to business logic or learning rules.
  3. Typecheck, Lint, Tests, and Build pass cleanly.
- **Validation Commands**: `npm run typecheck && npm run lint && npm run test && npm run build`
