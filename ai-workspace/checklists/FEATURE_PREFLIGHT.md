# LƯỜI ENGLISH — Feature Preflight & Release Gate Checklist

> **Mandatory Gate**: Every milestone, feature branch, or hotfix must pass this complete preflight matrix before claiming completion or merging into `foundation/v1` or `main`.

---

## Preflight Verification Matrix

| Gate # | Verification Step | Command / Evidence | Status |
| :--- | :--- | :--- | :--- |
| **Gate 1** | **Type Safety** | `npm run typecheck` (0 errors) | [ ] |
| **Gate 2** | **Code Hygiene & Linting** | `npm run lint` (0 warnings, 0 errors) | [ ] |
| **Gate 3** | **Automated Unit & Security Tests** | `npm run test` (100% tests passing) | [ ] |
| **Gate 4** | **Production Compilation** | `npm run build` (All routes cleanly built) | [ ] |
| **Gate 5** | **Security & Auth Rules** | `AUTH_CHECKLIST.md` & `FIRESTORE_CHECKLIST.md` verified | [ ] |
| **Gate 6** | **State Tracking** | `ai-workspace/PROJECT_STATE.md` updated with milestone status | [ ] |
| **Gate 7** | **Atomic Commit** | Focused commit message following Conventional Commits | [ ] |
| **Gate 8** | **Push & Synchronization** | Pushed to `origin/foundation/v1` and `origin/main` | [ ] |

---

## Operating Protocol for Agents
1. Inspect contracts, callers, and existing tests before writing code.
2. Maintain domain purity and repository patterns.
3. Fix failures immediately; re-run full matrix.
4. Stop when the milestone is complete and request review before starting the next milestone.
