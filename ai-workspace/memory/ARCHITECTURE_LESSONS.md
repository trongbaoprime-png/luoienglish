# LƯỜI ENGLISH — Architecture Lessons & Principles

> **Knowledge Classification**: System Architecture, Layer Boundaries, and Design Patterns  
> **Target Audience**: Full-stack Developers, Architects, AI Agents

---

## 1. Next.js 15 App Router Boundary Rules

### Server Components vs Client Components
- **Server Layout Guard (`src/app/parent/layout.tsx`)**:
  - Must remain a Server Component (`export const dynamic = "force-dynamic"`).
  - Verifies cryptographic session and server identity before rendering any child layout.
  - Never leaks privileged parental metrics, children profiles, or billing in SSR HTML if the session is locked or unverified.
- **Client Components (`"use client"`)**:
  - Used for interactive widgets (PIN keypad, audio players, interactive flashcards).
  - Must call server APIs (`/api/**`) with `Authorization: Bearer <idToken>` for mutations.
  - Must never perform sensitive business authorization locally.

---

## 2. Repository Pattern & Storage Isolation

```
Domain Engines (Pure TS)
      │
      ▼
Repository Interfaces (IRepository)
      │
      ├───────────────────────────────┬───────────────────────────────┐
      ▼                               ▼                               ▼
InMemory Repositories          Firestore Repositories         Future SQL / Cache
(Unit Tests / CI)              (Production / Live)            (Redis / SQLite)
```

- **Rule 2.1**: Domain engines (`MemoryEngine`, `RewardEngine`) depend ONLY on domain interfaces (`src/repositories/interfaces/*`), never on Firebase SDKs directly.
- **Rule 2.2**: `InMemoryRepository` and `FirestoreRepository` must maintain 100% feature and contract parity.
- **Rule 2.3**: `RepositoryFactory` selects the correct repository implementation based on environment configuration (`USE_FIREBASE_EMULATOR` / `NODE_ENV`).

---

## 3. Pure Domain Engines (Zero Framework Coupling)

- **Memory Engine (`src/domain/memory/`)**:
  - Implements modified SuperMemo SM-2 spaced repetition for Vietnamese children.
  - Pure calculation: `(currentMastery, recallRating, consecutiveStreak) => { newMastery, nextReviewDate, intervalDays }`.
  - Zero imports from React, Next.js, or Firebase.
- **Reward Engine (`src/domain/reward/`)**:
  - Pure reward calculation: `(activityType, masteryStatus, streakBonus) => { coins, stars, exp }`.
  - Atomic idempotency verification at repository layer.

---

## 4. Child-Scoped Preference Architecture

- **Problem**: Global `localStorage` theme settings cause multi-child collisions when siblings share the same tablet.
- **Architecture**:
  1. `ChildProfile.preferences.themeId` stored in Firestore as source of truth (`children/{childId}`).
  2. Client caches theme per child ID: `luoi_theme_${childId}`.
  3. Switching child immediately swaps theme tokens without page reload.
  4. Failed network persistence rolls back local state cleanly.

---

## 5. Defense-in-Depth Verification Layers

| Layer | Responsibility | Tooling |
| :--- | :--- | :--- |
| **Layer 1: Type Safety** | Compile-time domain model enforcement | TypeScript strict mode (`tsc --noEmit`) |
| **Layer 2: Linting & Hygiene** | Code style, unused imports, anti-patterns | ESLint (`next lint`) |
| **Layer 3: Unit & Engine Tests** | Pure business logic & algorithm validation | Node.js Test Runner (`tsx --test`) |
| **Layer 4: Security Rule Tests** | Multi-tenant isolation & privilege escalation checks | Firestore Emulator Security Tests |
| **Layer 5: Build Verification** | Static/dynamic route tree & SSR bundling | Next.js Production Build (`next build`) |
