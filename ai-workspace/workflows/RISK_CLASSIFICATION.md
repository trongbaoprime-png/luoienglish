# LƯỜI OS — Task Risk Classification System

> **Purpose**: Categorize task complexity, blast radius, and mandate appropriate verification depth.

---

## 1. Risk Tier Definitions

```
┌─────────────────────────────────────────────────────────────┐
│ R3: CRITICAL (Auth, Security, Child Privacy, Payments)       │
│ → Requires full adversarial Red Team attack review + tests  │
├─────────────────────────────────────────────────────────────┤
│ R2: HIGH (Architecture, Data Schemas, Domain Engines)       │
│ → Requires ADR, Preflight Critic review, unit test coverage │
├─────────────────────────────────────────────────────────────┤
│ R1: NORMAL (Standard Features, Learning Player UI, Audio)   │
│ → Requires standard preflight, lint, typecheck, build       │
├─────────────────────────────────────────────────────────────┤
│ R0: COSMETIC (Copy tweaks, CSS alignments, comments)        │
│ → Fast path: lint, typecheck, build                         │
└─────────────────────────────────────────────────────────────┘
```

| Tier | Risk Level | Description & Scope | Required Gates |
| :--- | :--- | :--- | :--- |
| **R0** | **Cosmetic** | Text copy edits, CSS styling tweaks, docs, comments. | Typecheck, Lint, Build. |
| **R1** | **Feature** | Non-critical UI components, player animations, audio assets. | Typecheck, Lint, Unit Tests, Build. |
| **R2** | **Architecture/Data** | Domain engines, repositories, database migrations, state machines. | ADR, Preflight Critic, 100% Engine Tests, Build. |
| **R3** | **Critical Security** | Authentication, authorization, PIN, sessions, child privacy, payments. | Full Preflight Critic, Red Team Review, Attack Tests, Build. |

---

## 2. Automatic Escalation Triggers to R3

A task is **AUTOMATICALLY ESCALATED TO R3** if it touches ANY of the following areas:
- [x] Firebase Authentication or token verification (`serverAuth.ts`).
- [x] Parental Gate, PIN hashing, or temporary lockout logic (`ParentalGateService.ts`).
- [x] Session tokens, cookie generation, or cryptographic signatures (`ParentModeSessionService.ts`, `ServerAccountSessionService.ts`).
- [x] Firestore Security Rules (`firestore.rules`).
- [x] Child personal data, avatar selection, or learning history.
- [x] In-app rewards, coins, star balances, or virtual currency transactions (`RewardEngine.ts`).
- [x] AI child tutor conversations, prompt templates, or gateway keys (`AIGateway.ts`).
- [x] System environment secrets (`PARENT_SESSION_SECRET`, Firebase Admin Private Key).
- [x] Administrative endpoints or privilege checks (`isAdmin()`).
