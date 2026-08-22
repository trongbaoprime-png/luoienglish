# LƯỜI OS — Security Lessons & Hardened Patterns Memory

> **Schema**: `ID` | `Context` | `Failure Pattern` | `Why It Failed` | `General Rule` | `Required Pattern` | `Attack/Test` | `Applies To`

---

### SEC-AUTH-001
- **ID**: `SEC-AUTH-001`
- **Context**: Server-side Route Handlers and API actions handling user or child modifications.
- **Failure Pattern**: Server trusted `parentUid` or `uid` supplied directly in client request body or query parameter.
- **Why It Failed**: An authenticated attacker can supply another user's `parentUid` in the JSON payload, bypassing client UI intent and performing unauthorized operations against victim data.
- **General Rule**: Authorization identity must NEVER originate from client-controlled payload data.
- **Required Pattern**:
  ```
  Incoming Request → Verify Cryptographic Token (Firebase Admin / Session) → Derive Trusted UID → Authorize Target Resource → Execute Operation
  ```
- **Attack/Test**: `serverAuth.test.ts` — Forged UID body parameter test (assert server derives trusted UID and ignores client-supplied `parentUid`).
- **Applies To**: All `/api/**` route handlers, server actions, mutation endpoints.

---

### SEC-AUTH-002
- **ID**: `SEC-AUTH-002`
- **Context**: Token verification utilities on backend server.
- **Failure Pattern**: Mock or test authentication logic (`mock_token_*`) leaked into production runtime verifiers.
- **Why It Failed**: Developers left `if (token.startsWith("mock_token_")) return mockUser;` in the shared production verifier, allowing attackers to forge arbitrary administrative identities.
- **General Rule**: Production verifiers must fail closed with `401 Unauthorized` on any mock token. Test verifiers must be isolated and injected strictly in test suites.
- **Required Pattern**: Separate `FirebaseIdTokenVerifier` (production) from `TestIdTokenVerifier` (test runner only).
- **Attack/Test**: `NODE_ENV=production Bearer mock_token_admin → 401 Unauthorized`.
- **Applies To**: `src/services/auth/serverAuth.ts`, middleware, token decoders.

---

### SEC-AUTH-003
- **ID**: `SEC-AUTH-003`
- **Context**: Route protection and layout guards in Next.js Server Components.
- **Failure Pattern**: Checking mere presence of a cookie (`if (cookie) renderContent()`) treated as authorization.
- **Why It Failed**: An attacker or child can send any dummy cookie named `parent_mode_session=1` or a random string, bypassing the gate if signature and cryptographic validity are not verified.
- **General Rule**: Cookie presence is NOT authorization. Authorization requires cryptographic signature verification, temporal validity checks, and stateful validation.
- **Required Pattern**: `verifyParentModeSession(cookieStore.get("parent_mode_session"), trustedUid, securityVersion)`
- **Attack/Test**: Random string cookie `parent_mode_session=fake` $\rightarrow$ Rejected, render `<ParentUnlockGuard />`.
- **Applies To**: `src/app/parent/layout.tsx`, all protected layouts and route guards.

---

### SEC-AUTH-004
- **ID**: `SEC-AUTH-004`
- **Context**: HMAC and symmetric encryption secret management.
- **Failure Pattern**: Hard-coded fallback secret string (`"default_secret_key_123"`) in source code.
- **Why It Failed**: When environment variables are missing in staging/production, the application silently falls back to known secrets, allowing forged signatures.
- **General Rule**: If a mandatory security secret (`PARENT_SESSION_SECRET`) is missing or weak (< 32 chars), fail closed (`500 ServerAuthError`) immediately.
- **Required Pattern**: `if (!secret || secret.length < 32) throw new ServerAuthError("PARENT_SESSION_SECRET unconfigured", 500);`
- **Attack/Test**: Production environment without `PARENT_SESSION_SECRET` throws 500; forged token signed with old fallback secret is rejected.
- **Applies To**: `ParentModeSessionService.ts`, `ServerAccountSessionService.ts`, crypto services.

---

### SEC-AUTH-005
- **ID**: `SEC-AUTH-005`
- **Context**: Parental Gate short-lived sessions and elevated privilege cookies.
- **Failure Pattern**: Privilege session (`parent_mode_session`) not bound to the authenticated account identity.
- **Why It Failed**: If Parent A unlocks Parent Mode and an attacker steals their `parent_mode_session` cookie, the attacker could use it from an unauthenticated browser or from Parent B's account.
- **General Rule**: Privileged elevated sessions must be cryptographically bound to a verified server account session (`trustedAccount.uid === session.parentUid`).
- **Required Pattern**:
  ```typescript
  const trustedAccount = verifyServerAccountSession(req);
  verifyParentModeSession(req, trustedAccount.uid, securityVersion);
  ```
- **Attack/Test**: Stolen Cookie Test: Parent B account + Parent A session cookie $\rightarrow$ `403 Forbidden`.
- **Applies To**: `src/app/parent/layout.tsx`, `/api/auth/pin`.

---

### SEC-AUTH-006
- **ID**: `SEC-AUTH-006`
- **Context**: Database update security rules (Firestore / SQL).
- **Failure Pattern**: Ownership checked only on incoming document state (`request.resource.data`), ignoring existing resource state (`resource.data`).
- **Why It Failed**: An attacker could modify an existing document belonging to another user if the rule only checked `request.resource.data.parentUid == request.auth.uid`.
- **General Rule**: Updates must verify that BOTH the existing resource AND the incoming resource belong to the authenticated caller.
- **Required Pattern**:
  ```
  allow update: if resource.data.parentUid == request.auth.uid &&
                   request.resource.data.parentUid == request.auth.uid;
  ```
- **Attack/Test**: Firestore security test: Parent A updating Parent B's document $\rightarrow$ `PERMISSION_DENIED`.
- **Applies To**: `firestore.rules`, all update mutation rules.

---

### SEC-AUTH-007
- **ID**: `SEC-AUTH-007`
- **Context**: Multi-tenant resource schemas and identity links.
- **Failure Pattern**: Mutable ownership identifiers (`childId`, `studentId`, `parentUid`) allowing resource takeover.
- **Why It Failed**: Allowing a document's ownership pointer to change during update enables an attacker to reassign someone else's progress or pet to their own child.
- **General Rule**: Ownership foreign keys (`childId`, `parentUid`, `studentId`) must be strictly immutable on update.
- **Required Pattern**: `request.resource.data.childId == resource.data.childId`
- **Attack/Test**: Firestore test: Mutating `childId` in `studentProgress` on update $\rightarrow$ `PERMISSION_DENIED`.
- **Applies To**: `firestore.rules`, SQL schema update constraints.

---

### SEC-LEARNING-001
- **ID**: `SEC-LEARNING-001`
- **Context**: Learning player, session completion, attempt evaluation, reward claims, and cognitive mastery updates.
- **Failure Pattern**: Server trusted client-submitted `completedActivityIds`, `evidences`, `evidence.correct`, `evidence.score`, `evidence.knowledgeIds`, or `starsEarned`.
- **Why It Failed**: A malicious client or browser extension could forge `correct=true` or `score=100` without actually solving activities, skip required activities to claim lesson rewards, or inject fake knowledge IDs into mastery calculations.
- **General Rule**: Any client-derived field affecting reward, mastery, progress, completion, entitlement, or privileges MUST be treated as untrusted and evaluated server-side.
- **Required Pattern**:
  ```
  1. Client sends raw response: { activityId, rawAnswer }
  2. Server loads authoritative Activity & Evaluator
  3. Server evaluates correctness, score, skill, and knowledgeIds
  4. Server writes trusted LearningEvidence to server-persisted LearningSession
  5. Lesson completion, rewards, and mastery updates consume ONLY trusted server evidences.
  ```
- **Attack/Test**: Red Team forged attempt payload with `correct=true` and `score=100` on wrong answer $\rightarrow$ Evaluated as `false` with 0 score; client skipping required activity $\rightarrow$ Completion rejected.
- **Applies To**: `/api/learning/**`, `LessonPlayer`, `ProgressController`, `MasteryUpdatePolicy`, `RewardEngine`.

---

### SEC-LEARNING-002
- **ID**: `SEC-LEARNING-002`
- **Context**: Adaptive Review attempts, transactional learning state mutations, optimistic concurrency version checks, and mastery/reward synchronization.
- **Failure Pattern**: Sequential awaited writes (`await repoA.save(); await repoB.save();`) mistaken for an atomic transaction. Server mutated `ReviewSession` in one write and `KnowledgeMastery` in a second write. If the second write failed or crashed, the database was left in a permanently desynced state.
- **Why It Failed**: Sequential `await` calls do NOT rollback previous writes when a subsequent write fails. A client retry after partial failure would see an incremented session version / existing attempt key and fail to repair the missing mastery mutation.
- **General Rule**: **Sequential awaited writes are NOT a transaction.** Authoritative learning state transitions spanning multiple documents (e.g. `ReviewSession` + `KnowledgeMastery` + `Reward`) MUST be executed inside a single datastore transaction (`runTransaction` in Firestore, or transactional unit of work).
  1. All source records (`ReviewSession`, `KnowledgeMastery`) MUST be read inside that transaction.
  2. Concurrency checks (`storedSession.version == expectedVersion`), session status checks, and attempt idempotency checks MUST be evaluated against the transaction-read snapshots.
  3. All mutations MUST commit atomically: ALL OR NOTHING.
- **Required Pattern**:
  ```
  runTransaction(async (tx) => {
    1. tx.get(sessionRef), tx.get(masteryRef)
    2. verify(session.version === expectedVersion, !isAttemptRecorded(session, attemptKey))
    3. compute(evalResult, updatedSession, updatedMastery)
    4. tx.set(sessionRef, updatedSession), tx.set(masteryRef, updatedMastery)
  })
  ```
- **Transaction Checklist**:
  - [ ] Are all authoritative documents mutated through one datastore transaction?
  - [ ] Are concurrency/version/idempotency checks performed INSIDE that transaction?
  - [ ] Are all source records used to calculate mutations read inside the same transaction?
- **Attack/Test**: `adaptiveReviewEngine.test.ts` — Failure injection test simulating datastore error before mastery write (asserts ZERO partial mutations), two-tab collision on same version (asserts exactly one commits and zero corrupted mastery), network retry (asserts idempotent replay without duplicate mutations).
- **Applies To**: `/api/learning/review/**`, `/api/learning/session/**`, `IReviewAttemptTransactionRepository`, `ReviewAttemptTransactionService`, `FirestoreReviewAttemptTransactionRepository`.

---

### SEC-AUTH-008
- **ID**: `SEC-AUTH-008`
- **Context**: Multi-tenant authorization and parent-child hierarchy.
- **Failure Pattern**: Generic `isAuthenticated()` check mistaken for authorization of a specific child.
- **Why It Failed**: Checking if a user is logged in does not prove they are the parent of the target child.
- **General Rule**: Any operation on child data must resolve child ownership (`isParentOfChild(childId)`) against `request.auth.uid`.
- **Required Pattern**:
  ```
  function isParentOfChild(childId) {
    return isAuthenticated() &&
      get(/databases/$(database)/documents/children/$(childId)).data.parentUid == request.auth.uid;
  }
  ```
- **Attack/Test**: Parent A reading `studentProgress` of Parent B's child $\rightarrow$ `PERMISSION_DENIED`.
- **Applies To**: `firestore.rules`, server route handlers.

---

### SEC-AUTH-009
- **ID**: `SEC-AUTH-009`
- **Context**: Client-side UI state and Parental Gate modals.
- **Failure Pattern**: UI parental gate modal or React state mistaken for a security boundary.
- **Why It Failed**: Direct URL navigation (e.g. typing `/parent` in browser URL bar) bypasses client modal dialogs if the server layout doesn't enforce server-side gating.
- **General Rule**: UI modals are user experience conveniences; the server layout / API is the only authoritative security boundary.
- **Required Pattern**: Server Component layout guard in `src/app/parent/layout.tsx` rendering locked placeholder when session is unverified.
- **Attack/Test**: Direct URL access test to `/parent` without session cookie $\rightarrow$ Server renders `<ParentUnlockGuard />` with zero privileged SSR HTML.
- **Applies To**: All protected client views and Next.js App Router layouts.

---

### SEC-AUTH-010
- **ID**: `SEC-AUTH-010`
- **Context**: Session lifecycle and credential revocation.
- **Failure Pattern**: Missing session revocation/invalidation when user resets or changes their PIN/password.
- **Why It Failed**: Stateless session tokens remained valid for their remaining TTL (15 min) after a parent changed a compromised PIN.
- **General Rule**: Credential modifications must immediately invalidate all previously issued privilege sessions via stateful `securityVersion`.
- **Required Pattern**: Increment `securityVersion` on PIN change/reset $\rightarrow$ Validate `session.securityVersion === currentSecurityVersion`.
- **Attack/Test**: Verify that token created before PIN change is rejected immediately after PIN update.
- **Applies To**: `ParentalGateService.ts`, `serverAuth.ts`.

---

### SEC-DATA-001
- **ID**: `SEC-DATA-001`
- **Context**: Database collections containing child personal or progress data.
- **Failure Pattern**: Using generic `allow read: if request.auth != null;` for child data.
- **Why It Failed**: Any registered user could scrape every child's learning history, mastery scores, and pet companions across the entire platform.
- **General Rule**: Child-owned collections must be strictly multi-tenant scoped to the owning parent UID.
- **Required Pattern**: Gate every child document by `isParentOfChild(childId)`.
- **Attack/Test**: Automated test verifying Parent A cannot query or get Parent B's child data.
- **Applies To**: `firestore.rules` (`studentProgress`, `knowledgeMastery`, `pets`, `rewardBalances`).

---

### SEC-DATA-002
- **ID**: `SEC-DATA-002`
- **Context**: Gamification rewards, coin ledgers, and virtual currency balances.
- **Failure Pattern**: Allowing direct client SDK write access to reward balances or transactions.
- **Why It Failed**: Untrusted web clients can modify local Firestore SDK code and credit unlimited coins/stars to their own account.
- **General Rule**: Virtual ledgers and financial balances must be server-authoritative (`allow write: if false;`). Mutations happen exclusively through server transactions.
- **Required Pattern**:
  ```
  match /rewardBalances/{childId} { allow write: if false; }
  match /rewardTransactions/{txId} { allow write: if false; }
  ```
- **Attack/Test**: Direct client write test to `rewardBalances` $\rightarrow$ `PERMISSION_DENIED`.
- **Applies To**: `firestore.rules`, `FirestoreRewardRepository.ts`.

---

### SEC-REWARD-001
- **ID**: `SEC-REWARD-001`
- **Context**: Gamification rewards, motivation projections (Daily Goals, Achievements, Streaks, Presentation).
- **Failure Pattern**: A core reward transaction commits, but dependent projections are executed non-atomically in subsequent unmanaged calls (`if (isNew) { doSideEffects(); }`). If the process crashes or network fails between ledger write and projection execution, the projections become permanently skipped on retry because `isNew` returns false.
- **Why It Failed**: Lack of transactional outbox or replayable idempotency key for projections makes state updates unrecoverable.
- **General Rule**: A server-authoritative event may affect multiple projections/state machines. A successful core ledger commit must never make dependent projections permanently unrecoverable. Use: atomic transaction, transactional outbox, or idempotently replayable projection processing.
- **Required Pattern**:
  ```
  [RewardTransaction + RewardBalance + MotivationEvent (Outbox)] committed in ONE atomic transaction
  → Idempotent Projection Processor runs projections with deterministic projectionKeys (proj_${eventId}_${targetId})
  → On retry/crash recovery, re-runs unprocessed projections with zero duplicate rewards.
  ```
- **Attack/Test**: Crash injection between reward commit and goal/achievement projection $\rightarrow$ verify re-execution completes all projections idempotently with zero duplicate currency.
- **Applies To**: `RewardService.ts`, `MotivationProjectionProcessor.ts`, `FirestoreRewardRepository.ts`, `DailyGoalService.ts`, `AchievementService.ts`.

---

### SEC-REWARD-002
- **ID**: `SEC-REWARD-002`
- **Context**: Projection processors mutating domain aggregates (Daily Goals, Achievements).
- **Failure Pattern**: Using non-atomic check-then-mutate patterns (`if (!isProjectionProcessed(key)) { mutateAggregate(); recordMarker(key); }`).
- **Why It Failed**: Under concurrent worker executions or process interruption, two workers can simultaneously observe that the marker does not exist and both apply the mutation, causing duplicate progression and race conditions. Alternatively, a crash between mutation and marker write leaves the marker missing.
- **General Rule**: Projection idempotency must be enforced atomically at the datastore mutation boundary. Marker read, aggregate mutation, and marker write must commit inside ONE atomic transaction.
- **Required Pattern**:
  ```
  Inside ONE datastore transaction (runTransaction):
  1. Read projection marker
  2. Read aggregate state
  3. If marker exists: return no-op
  4. Else: compute transition, write updated aggregate, write marker
  5. Commit atomically
  ```
- **Attack/Test**: Concurrent projection workers targeting the same aggregate with identical projection keys $\rightarrow$ assert aggregate delta is applied effectively once and exactly one unlock occurs.
- **Applies To**: `DailyGoalService.ts`, `AchievementService.ts`, `FirestoreDailyGoalRepository.ts`, `FirestoreAchievementRepository.ts`.


