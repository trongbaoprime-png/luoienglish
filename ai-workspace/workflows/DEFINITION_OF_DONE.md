# LƯỜI OS — Definition of Done (DoD v2)

> **Standard**: Replaces naive `code → build → done` with the rigorous 10-step verified engineering lifecycle.

---

## The 10-Step Definition of Done Pipeline

```
1. Task Contract Established (Scope, risk tier, non-goals)
   ↓
2. Preflight Review Passed (All 13 Critic questions answered)
   ↓
3. Implementation (Clean domain purity & repository patterns)
   ↓
4. Unit & Pure Engine Tests (100% pass)
   ↓
5. Integration & Security Tests (Database & auth flows pass)
   ↓
6. Critic Review (Code scrutinized against architectural rules)
   ↓
7. Adversarial Red Team Attack (18 attack classes evaluated: 0 FAILs)
   ↓
8. Regression Suite (Entire repository test suite passes)
   ↓
9. Production Build (Next.js 15 clean compile across all routes)
   ↓
10. Evidence Logged & Atomic Commit (SHA, test counts, state sync)
```

### Strict Exit Gates:
- **No Unverifiable Claims**: Language like "100% secure" or "guaranteed" is banned.
- **Empirical Evidence Required**: Must quote exact test outputs (e.g. `43/43 tests passed, 0 lint errors, 21 routes built`).
- **Human Gating**: Agent stops and requests review before proceeding to the next major milestone.
