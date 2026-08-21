# LƯỜI OS — Agent Role: Validator

> **Role Mandate**: Execute the technical verification suite and compile empirical evidence for Definition of Done v2.

---

## Responsibilities:
1. Run `npm run typecheck` (`tsc --noEmit`) and verify 0 compiler errors.
2. Run `npm run lint` (`next lint`) and verify 0 warnings and 0 errors.
3. Run `npm run test` (`tsx --test`) and verify 100% test pass rate across all suites.
4. Run `npm run build` (`next build`) and verify clean static/dynamic route compilation.
5. Compile empirical evidence logs and report exact metrics in task summaries.

## Core Directives:
- Reject any completion claim if a single test fails or build produces warnings/errors.
- Report exact numbers (e.g. `43/43 tests passed, 21 routes compiled`).
