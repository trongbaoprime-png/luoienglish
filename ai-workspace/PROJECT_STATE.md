# LƯỜI ENGLISH — Project State & Control Center

> **Current Phase**: Phase 1 — Foundation, Knowledge Graph, Adaptive Review & Pet Companion  
> **Active Milestone**: LE-010 Complete (Pet Companion Core & Emotional Learning Loop)  
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
| **LE-008** | Adaptive Review & Memory Loop | R2 Data/Architecture | Superseded | Learning / Memory |
| **LE-008B** | Atomic Adaptive Review Attempts | R3 Security/Data | Superseded | Lead Architect |
| **LE-008C** | True Atomic Learning State Commit | R3 Security/Data | **COMPLETED** | Lead Architect |
| **LE-009** | Reward Economy & Motivation Engine | R2 Data/Architecture | Superseded | Gamification Architect |
| **LE-009B** | Atomic Motivation Event Processing | R3 Security/Data | Superseded | Lead Architect |
| **LE-009C** | Atomic & Idempotent Motivation Projection Application | R3 Security/Data | **COMPLETED** | Lead Architect |
| **LE-010** | Pet Companion Core & Emotional Learning Loop | R2 Data/Architecture | **COMPLETED** | Lead Architect |
| **LE-011** | First Vertical Slice & Production Art Integration | R2 Data/Architecture | Backlog | Lead Architect |

---

## Verification Log
- [x] Workspace initialized on `foundation/v1`
- [x] Documentation & Character Bible created (Chú Lười - Sloth IP strictly enforced, zero dino identity)
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
- [x] **LE-007B Complete**: Server-Authoritative Learning Evidence & Anti-Cheat Session (68/68 tests passing)
- [x] **LE-008C Complete**: True datastore transactions across `ReviewSession` + `KnowledgeMastery` via `IReviewAttemptTransactionRepository`
- [x] **LE-009C Complete**: Atomic transactional outbox + projection idempotency marker inside single datastore transaction
- [x] **LE-010 Complete**:
  - **Pet Companion Core**: Server-authoritative `PetProfile` (Chú Lười), non-punitive hunger (safe lower bound 20), and 4 core dimensions (🍎 Hunger, ❤️ Happiness, ⚡ Energy, 💛 Bond).
  - **Atomic Feed Transaction**: `RewardBalance.totalPetFood` deduction + `PetProfile` stats & version mutation + `PetInteractionTransaction` committed in ONE atomic transaction (`runTransaction`).
  - **Learning-Driven Growth & Bond**: `GrowthPolicy` requires cumulative Learning XP + Bond (cannot be farmed by food alone); `BondPolicy` provides anti-spam interaction caps.
  - **Emotional Learning Loop**: `PetReactionEngine` maps MotivationEvents and interactions to semantic emotions, animations, and child-safe bilingual dialogue ("Thử lại cùng Lười nhé!").
  - **UI & Contracts**: `PetHome`, `PetAvatar`, `PetStatsDisplay`, `FeedButton`, `InteractionMenu`, `PetReactionLayer`, dual-theme support, semantic animation and audio registries.
  - **LE-011 Preparation**: Created `docs/design/PRODUCTION_ASSET_REQUIREMENTS.md` specifying complete production art, animation, and audio inventory.
  - 116/116 tests passing across 14 test suites, 0 lint errors, 0 type errors, 28/28 production routes compiled cleanly.
- [ ] **LE-011**: First Vertical Slice & Production Art Integration (Awaiting Human Approval)
