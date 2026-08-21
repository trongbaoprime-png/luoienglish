# LƯỜI OS — Production Release Gate Checklist

> **Mandatory Rule**: Use before tagging any release or merging a milestone into `main`.  
> **Valid Answers**: `PASS` | `FAIL` | `N/A` | `UNKNOWN`  
> **CRITICAL RULE**: Any `FAIL` or security-critical `UNKNOWN` blocks release deployment immediately.

---

## 1. Automated Verification Gates
- [ ] **Type Safety**: `npm run typecheck` passes with 0 TypeScript compiler errors. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Lint & Hygiene**: `npm run lint` passes with 0 warnings and 0 errors. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Unit & Engine Tests**: `npm run test` passes 100% of test suites. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Production Build**: `npm run build` compiles cleanly across all routes. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)

## 2. Security & Compliance Verification
- [ ] **Zero Mock Token in Production**: `FirebaseIdTokenVerifier` strictly rejects `mock_token_*`. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Fail-Closed Secrets**: `PARENT_SESSION_SECRET` is configured with >= 32 high-entropy characters. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Adversarial Red Team Attack**: Complete attack matrix verified with 0 vulnerabilities. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Child Safety (COPPA/GDPR-K)**: Zero PII of children stored or transmitted. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)

## 3. Brand & Pedagogical Integrity
- [ ] **Mascot Check**: Mascot is exclusively **CHÚ LƯỜI** (Sloth); zero Dinosaur IP. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Brand Slogan**: "Lười học mà vẫn giỏi." correctly reflected in user-facing copy. (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
