# LƯỜI ENGLISH — Project State & Control Center

> **Current Phase**: Phase 1 — Foundation, Knowledge Graph & Learning Player  
> **Active Milestone**: LE-007B Complete (Server-Authoritative Learning Evidence & Anti-Cheat Session)  
> **Target Branch**: `foundation/v1`  
> **Architecture Health**: PASSING (100% Typecheck, Lint, Tests, Build)  

---

## Active Task Index

| Task ID | Task Name | Risk Level | Status | Owner |
| :--- | :--- | :--- | :--- | :--- |
| **LE-001** | Foundation Bootstrap | R2 Data/Architecture | **COMPLETED** | Lead Architect |
| **LE-002** | Child-Scoped Dual-Theme Polish | R1 Feature | **COMPLETED** | Senior Frontend |
| **LE-003** | Real Firebase Foundation & Atomic Idempotency | R2 Data/Architecture | **COMPLETED** | Senior Backend |
| **LE-003B** | Firestore Ownership Hardening & Theme Persistence | R3 Security/Data | **COMPLETED** | Senior Backend |
| **LE-003C** | Strict Multi-Tenant Child Data Ownership | R3 Security/Data | **COMPLETED** | Security Architect |
| **LE-003D** | Immutable Ownership Fields Hardening | R3 Security/Data | **COMPLETED** | Security Architect |
| **LE-004** | Parent Authentication & Parental Gate | R3 Security/Auth | **COMPLETED** | Security / Auth |
| **LE-004B** | Authenticated Server Identity Enforcement | R3 Security/Auth | **COMPLETED** | Security / Auth |
| **LE-004C** | Parent Mode Security Boundary Hardened | R3 Security/Auth | **COMPLETED** | Security / Auth |
| **LE-004D** | Fail-Closed Parent Session & Route Guard | R3 Security/Auth | **COMPLETED** | Security / Auth |
| **LE-004E** | Verified Parent Route Boundary & Zero Default PIN | R3 Security/Auth | **COMPLETED** | Security / Auth |
| **LE-004F** | Account-Bound Parent Session & Stolen Cookie Defense | R3 Security/Auth | **COMPLETED** | Security / Auth |
| **LOS-001** | LƯỜI OS Agent Engineering Harness v1 | R2 Architecture | **COMPLETED** | Lead Architect |
| **LE-005** | Secure Multi-Child Profile Management | R3 Security/Auth | **COMPLETED** | Senior Full-stack |
| **LE-006** | Curriculum & Learning Knowledge Foundation | R2 Data/Architecture | **COMPLETED** | Content / Curriculum |
| **LE-007** | Learning Player Interactive Engine | R1 Feature | Superseded | Senior Frontend |
| **LE-007B** | Server-Authoritative Learning Evidence | R3 Security/Data | **COMPLETED** | Lead Architect |
| **LE-008** | Server-Trusted Reward Ledger | R2 Data/Architecture | Backlog | Senior Backend |
| **LE-009** | Chú Lười Pet Companion Foundation | R1 Feature | Backlog | Gamification Engineer |
| **LE-010** | Adventure Map Navigation Hub | R1 Feature | Backlog | Senior Frontend |
| **LE-011** | First Vertical Slice Integration | R2 Data/Architecture | Backlog | Lead Architect |

---

## Verification Log
- [x] Workspace initialized on `foundation/v1`
- [x] Documentation & Character Bible created (Chú Lười - Sloth IP strictly enforced)
- [x] Strict TypeScript domain types & pure domain engines
- [x] **LE-002 Complete**: Child-scoped theme isolation with independent multi-child preference storage
- [x] **LE-003 Complete**: Real Firestore SDK integration with atomic reward idempotency transaction
- [x] **LE-003B Complete**: `ChildProfile.preferences.themeId` persisted in Firestore; security rules tests
- [x] **LE-003C Complete**: Strict multi-tenant isolation across all collections; theme rollback on persistence failure
- [x] **LE-003D Complete**: Immutable ownership fields on update; 23/23 tests passing
- [x] **LE-004 Complete**: Parent authentication and parental gate foundation
- [x] **LE-004B Complete**: Authenticated server identity enforcement
- [x] **LE-004C Complete**: Parent Mode Security Boundary Hardened
- [x] **LE-004D Complete**: Fail-Closed Parent Session & Route Guard
- [x] **LE-004E Complete**: Verified Parent Route Boundary & Zero Default PIN
- [x] **LE-004F Complete**: Account-Bound Parent Session & Stolen Cookie Defense
- [x] **LOS-001 Complete**: LƯỜI OS Agent Engineering Harness v1 (Memory, Checklists, Workflows, DoD v2)
- [x] **LE-005 Complete**: Secure Multi-Child Profile Management (50/50 tests pass)
- [x] **LE-006 Complete**: Reusable Knowledge Graph with multidimensional relationships, dual-track evaluation, 56/56 tests passing
- [x] **LE-007B Complete**:
  - SEC-LEARNING-001 added to institutional memory & checklists (zero blind trust for client learning evidence)
  - Deterministic server-side `ActivityEvaluatorFactory` & evaluators (`MultipleChoiceEvaluator`, `SentenceBuilderEvaluator`, `WritingEvaluator`, `MatchPairsEvaluator`, `SpeakingEvaluator`, `VocabularyCardEvaluator`)
  - Server-persisted `LearningSession` with `ILearningSessionRepository` (`InMemoryLearningSessionRepository` & `FirestoreLearningSessionRepository`)
  - Endpoints: `POST /api/learning/session/start`, `POST /api/learning/session/[sessionId]/attempt`, `POST /api/learning/session/[sessionId]/complete`, `GET /api/learning/session/[sessionId]`
  - Strict Anti-Cheat: client sends raw input only; server computes correctness, score, skill, knowledgeIds, and commits rewards idempotently
  - Optimistic concurrency with `version` counter preventing stale tab overwrites
  - Demo fallback removed (`child_sample_1` eliminated; requires explicit active child profile)
  - Safe network failure handling (local state preserved on 500 error; only cleared on verified 200 OK)
  - 68/68 tests passing across 10 test suites, 0 lint errors, 23/23 routes compiled
- [ ] **LE-008**: Server-Trusted Reward Ledger (Awaiting Human Approval)
