# Task Contract: LE-003 — Real Firebase & Firestore Foundation

- **Task ID**: `LE-003`
- **Goal**: Implement complete production-ready Firestore repositories that execute actual Firestore SDK operations (collections, documents, queries, converters, and atomic transactions) rather than delegating to InMemory mock repositories.
- **Risk Level**: `R2 Data/Architecture`
- **Context Required**: `docs/architecture/ARCHITECTURE.md`, `src/repositories/interfaces/`
- **Files Allowed**: `src/repositories/firebase/`, `src/repositories/memory/`, `src/services/firebase/`, `src/repositories/RepositoryFactory.ts`

## Impact Analysis
- **Current State**: `Firestore*Repository` classes were stubbed to proxy calls to `InMemory*Repository`.
- **Target State**:
  1. Full Firestore implementation using typed collection references, document snapshot converters, and real queries for all 6 domain entities (`children`, `curricula`, `studentProgress`, `rewardTransactions`/`rewardBalances`, `knowledgeMastery`, `pets`).
  2. **Atomic Idempotency for Rewards**: `FirestoreRewardRepository` implements `runTransaction` where `rewardTransactions/{idempotencyKey}` is checked and written atomically alongside `rewardBalances/{childId}` update, eliminating race conditions.
  3. `InMemoryRewardRepository` also updated with atomic check-and-insert guarantees for test environments.
  4. Repository Factory pattern (`RepositoryFactory.ts`) allowing explicit runtime selection between Firestore and InMemory based on environment (`USE_IN_MEMORY_REPOSITORIES` flag or live Firebase credentials).
- **Acceptance Criteria**:
  1. Firestore repositories execute authentic Firestore queries when Firebase credentials are configured.
  2. Zero silent fallback to InMemory in production mode.
  3. Atomic reward idempotency verified with tests.
  4. Typecheck, Lint, Tests, and Build pass with 0 errors.
- **Validation Commands**: `npm run typecheck && npm run lint && npm run test && npm run build`
