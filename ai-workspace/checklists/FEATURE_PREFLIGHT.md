# LƯỜI OS — Feature Preflight & Gate Matrix Checklist

> **Mandatory Rule**: Every task must pass this complete preflight matrix before claiming completion.  
> **Valid Answers**: `PASS` | `FAIL` | `N/A` | `UNKNOWN`  
> **CRITICAL RULE**: Any `FAIL` or security-critical `UNKNOWN` blocks task completion.

---

## Preflight Verification Matrix

| Gate # | Verification Step | Command / Evidence | Status |
| :--- | :--- | :--- | :--- |
| **Gate 1** | **Type Safety** | `npm run typecheck` (0 errors) | `PASS` / `FAIL` / `N/A` / `UNKNOWN` |
| **Gate 2** | **Code Hygiene & Linting** | `npm run lint` (0 warnings, 0 errors) | `PASS` / `FAIL` / `N/A` / `UNKNOWN` |
| **Gate 3** | **Automated Unit & Security Tests** | `npm run test` (100% tests passing) | `PASS` / `FAIL` / `N/A` / `UNKNOWN` |
| **Gate 4** | **Production Compilation** | `npm run build` (All routes cleanly built) | `PASS` / `FAIL` / `N/A` / `UNKNOWN` |
| **Gate 5** | **Security & Auth Rules** | `AUTH_CHECKLIST.md` & `FIRESTORE_CHECKLIST.md` verified | `PASS` / `FAIL` / `N/A` / `UNKNOWN` |
| **Gate 6** | **State Tracking** | `ai-workspace/PROJECT_STATE.md` updated with milestone status | `PASS` / `FAIL` / `N/A` / `UNKNOWN` |
| **Gate 7** | **Atomic Commit** | Focused commit message following Conventional Commits | `PASS` / `FAIL` / `N/A` / `UNKNOWN` |
| **Gate 8** | **Push & Synchronization** | Pushed to `origin/foundation/v1` and `origin/main` | `PASS` / `FAIL` / `N/A` / `UNKNOWN` |
