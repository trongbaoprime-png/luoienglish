# LƯỜI ENGLISH — Architecture Decision Records (ADR History)

> **Knowledge Classification**: Architecture Log & Historical Decision Tree  
> **Repository**: `trongbaoprime-png/luoienglish`

---

### ADR-001: Foundation Architecture & Tech Stack (LE-001)
- **Date**: 2026-08-21
- **Status**: Accepted
- **Decision**: Built on Next.js 15 App Router, TypeScript strict mode, Tailwind CSS design tokens, and clean domain layers (`domain/memory`, `domain/reward`).
- **Rationale**: Long-term scalability, type safety, and zero framework lock-in for core pedagogical logic.

---

### ADR-002: Dual-Theme Child Preference Isolation (LE-002)
- **Date**: 2026-08-21
- **Status**: Accepted
- **Decision**: Child theme preferences (`cozy` vs `explorer`) are scoped per child profile in Firestore and cached locally under `luoi_theme_${childId}`.
- **Rationale**: Prevents sibling preference collisions on shared family tablets.

---

### ADR-003: Real Firebase v13 Modular SDK & Atomic Reward Idempotency (LE-003)
- **Date**: 2026-08-21
- **Status**: Accepted
- **Decision**: Implemented real Firebase v13 modular SDKs; enforced atomic idempotency in `FirestoreRewardRepository` via Firestore transactions with duplicate key rejection.
- **Rationale**: Eliminates race conditions, duplicate reward credits, and balance desynchronization.

---

### ADR-004: Multi-Tenant Firestore Ownership & Immutable Fields (LE-003C & LE-003D)
- **Date**: 2026-08-21
- **Status**: Accepted
- **Decision**: Created reusable `isParentOfChild(childId)` helper across all Firestore collections; enforced immutable `childId`, `studentId`, and `parentUid` on document updates.
- **Rationale**: Prevents multi-tenant data leaks and document hijacking between distinct parent accounts.

---

### ADR-005: 100,000-Iteration PBKDF2 & Stateful Session Invalidation (LE-004C & LE-004D)
- **Date**: 2026-08-21
- **Status**: Accepted
- **Decision**: Upgraded parental PIN hashing to `PBKDF2-HMAC-SHA256` with 100,000 iterations and 16-byte random salt. Embedded `securityVersion` in PIN records and sessions; incremented on PIN change/reset.
- **Rationale**: State-of-the-art resistance against GPU cracking; immediate revocation of all active sessions upon PIN modification.

---

### ADR-006: Account-Bound Server Route Guard & Zero Default PIN (LE-004E & LE-004F)
- **Date**: 2026-08-21
- **Status**: Accepted
- **Decision**:
  1. Established 4 distinct auth states (`Firebase Client Auth` $\rightarrow$ `Server Account Session` $\rightarrow$ `Child Session` $\rightarrow$ `Parent Mode Session`).
  2. Server layout (`src/app/parent/layout.tsx`) cryptographically verifies both `auth_session` and matching `parent_mode_session`.
  3. Eliminated all default PINs ("1234") from code and UI; enforced explicit setup flow when `isPinSet: false`.
- **Rationale**: Total protection against stolen PIN cookies, SSR data leakage, and unauthorized parental control bypass.
