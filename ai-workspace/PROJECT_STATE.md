# LƯỜI ENGLISH — Project State & Control Center

> **Current Phase**: Phase 0 — Foundation Bootstrap & Security Hardening  
> **Active Milestone**: LE-003C Strict Child Data Ownership Complete  
> **Target Branch**: `foundation/v1`  
> **Architecture Health**: PASSING (100% Typecheck, Lint, 18/18 Tests, Build)  

---

## Active Task Index

| Task ID | Task Name | Risk Level | Status | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **LE-001** | Foundation Bootstrap | R2 Data/Architecture | **COMPLETED** | Lead Architect |
| **LE-002** | Child-Scoped Dual-Theme Polish | R1 Feature | **COMPLETED** | Senior Frontend |
| **LE-003** | Real Firebase Foundation & Atomic Idempotency | R2 Data/Architecture | **COMPLETED** | Senior Backend |
| **LE-003B** | Firestore Ownership Hardening & Theme Persistence | R3 Security/Data | **COMPLETED** | Senior Backend |
| **LE-003C** | Strict Multi-Tenant Child Data Ownership | R3 Security/Data | **COMPLETED** | Security Architect |
| **LE-004** | Parent Authentication & PIN Gate | R3 Security/Auth | Blocked / Backlog | Security / Auth |
| **LE-005** | Child Profile Management | R3 Security/Auth | Backlog | Senior Full-stack |
| **LE-006** | Curriculum Seed & Validation | R1 Feature | Backlog | Content / Curriculum |
| **LE-007** | Learning Player Interactive Engine | R1 Feature | Backlog | Senior Frontend |
| **LE-008** | Server-Trusted Reward Ledger | R2 Data/Architecture | Backlog | Senior Backend |
| **LE-009** | Chú Lười Pet Companion Foundation | R1 Feature | Backlog | Gamification Engineer |
| **LE-010** | Adventure Map Navigation Hub | R1 Feature | Backlog | Senior Frontend |
| **LE-011** | First Vertical Slice Integration | R2 Data/Architecture | Backlog | Lead Architect |

---

## Verification Log
- [x] Workspace initialized on `foundation/v1`
- [x] Documentation & Character Bible created (Chú Lười - Sloth IP strictly enforced)
- [x] Strict TypeScript domain types & pure domain engines
- [x] Next.js 15 production build passing
- [x] **LE-002 Complete**: Child-scoped theme isolation with independent multi-child preference storage
- [x] **LE-003 Complete**: Real Firestore SDK integration with atomic reward idempotency transaction
- [x] **LE-003B Complete**: `ChildProfile.preferences.themeId` persisted in Firestore; security rules tests.
- [x] **LE-003C Complete**:
  - `firestore.rules` updated with reusable `isParentOfChild(childId)` ownership helper.
  - Strict multi-tenant isolation across `children`, `studentProgress`, `knowledgeMastery`, `pets`, `rewardBalances`, and `rewardTransactions`.
  - Client write forbidden on reward balances and transactions.
  - Theme persistence rollback and explicit sync error states implemented in `ThemeProvider`.
  - 18/18 Unit and Security tests passing.
  - Repository APIs enforce child-scoped reads.
- [ ] **LE-004**: Parent Authentication & PIN Gate (Awaiting Review Approval)
