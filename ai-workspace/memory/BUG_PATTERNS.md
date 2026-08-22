# LƯỜI ENGLISH — Known Bug Patterns & Anti-Patterns

> **Knowledge Classification**: Diagnostic Guide & Anti-Pattern Encyclopedia  
> **Purpose**: Prevent regression of previously identified and solved bugs

---

## 1. Auth & Token Bugs

### Pattern 1.1: Unused Variable Imports Breaking Production Builds
- **Symptoms**: `next build` fails with `@typescript-eslint/no-unused-vars` (e.g. `verifyFirebaseIdToken is defined but never used`).
- **Root Cause**: Next.js 15 production build treats ESLint errors as fatal compilation failures.
- **Fix**: Run `npm run lint` before committing; remove all unused imports or prefix with `_` if intentionally ignored.

### Pattern 1.2: Mock Token Escaping into Production Server
- **Symptoms**: Insecure bypasses allowing arbitrary `mock_token_admin` in live environments.
- **Root Cause**: Using a single verifier that checks `if (token.startsWith("mock_token_")) return mockUser;` in all environments.
- **Fix**: Separate `FirebaseIdTokenVerifier` (fails with `401` on any mock token) from `TestIdTokenVerifier` (injected only during unit tests).

### Pattern 1.3: Conflating `user.securityVersion` with `pinRecord.securityVersion`
- **Symptoms**: Invalidation check fails if user hasn't set a PIN record yet.
- **Fix**:
  ```typescript
  const pinRecord = await userRepo.getPinRecord(trustedUid);
  if (pinRecord?.securityVersion !== undefined) {
    expectedSecurityVersion = pinRecord.securityVersion;
  } else {
    const user = await userRepo.findById(trustedUid);
    expectedSecurityVersion = user?.securityVersion;
  }
  ```

---

## 2. Session & Temporal Bugs

### Pattern 2.1: Clock Skew Causing Spurious Session Rejections
- **Symptoms**: Valid tokens created on one server/process fail verification on another due to 100ms clock differences.
- **Fix**: Allow `CLOCK_SKEW_MS = 60 * 1000` (1 minute) tolerance for `createdAt` check, while strictly enforcing `expiresAt`.

### Pattern 2.2: Stolen Session Cookie Replay Across Accounts
- **Symptoms**: Attacker with Parent A's PIN cookie accesses `/parent` on Browser B logged in as Parent B.
- **Fix**: Bind session verification to `trustedAccount.uid`:
  ```typescript
  if (session.parentUid !== trustedAccountUid) {
    throw new ServerAuthError("Phiên không thuộc về tài khoản hiện tại.", 403);
  }
  ```

---

## 3. UI & UX Anti-Patterns

### Pattern 3.1: Hard-Coded Demo Text in UI Components
- **Symptoms**: Helper text like `"Mã mặc định: 1234"` displayed on live production screens.
- **Fix**: Grep codebase for `"1234"` and `"mặc định"`; ensure initial PIN flow prompts user to create a PIN rather than displaying demo credentials.

### Pattern 3.2: Multi-Child Local Storage Collision
- **Symptoms**: Child A changes theme to "Explorer" (Dark/Blue); Child B opens app and sees theme changed to "Explorer" instead of "Cozy" (Warm/Orange).
- **Fix**: Scope local cache keys by child ID: `luoi_theme_${childId}` and sync with Firestore profile.

---

## 4. Learning & Gamification Integrity Anti-Patterns

### Pattern 4.1: Client-Submitted Learning Evidence Trust
- **Symptoms**: Browser submits `completedActivityIds`, `evidences[].correct = true`, or `score = 100`, and server directly credits rewards and computes mastery.
- **Root Cause**: Architecture conflated UI interactive state with authoritative progress records.
- **Fix**: Server-side `LearningSession` holds the authoritative activity sequence. Client sends only raw response data (`selectedOptionId`, `typedText`, `userBuiltSentence`). Server domain evaluators determine correctness, score, and commit rewards idempotently upon verified completion.

### Pattern 4.2: Partial Learning Transaction & Pre-Commit Side Effects
- **Symptoms**: Concurrent browser tabs or network retries result in double mastery increments or inconsistent review queue state despite optimistic concurrency errors.
- **Root Cause**: Mutating `KnowledgeMastery` in database *before* validating `storedSession.version == expectedVersion` and before committing the session.
- **Fix**: Concurrency version checks and attempt idempotency checks MUST occur prior to any side effect. Use atomic transactional application services (`ReviewAttemptTransactionService`) so that session state, evidences, and cognitive mastery commit as an all-or-nothing atomic unit.

### Pattern 4.3: Conflating "Attempted" with "Completed"
- **Symptoms**: An item is added to `completedItemIds` or marked `item.completed = true` when the child answers incorrectly or fails the challenge.
- **Root Cause**: Progress controller / attempt handler pushed `currentItem.id` into completed list unconditionally without evaluating `evalResult.correct === true`.
- **Fix**: An item is marked `completed = true` and appended to `completedItemIds` ONLY when its completion policy (e.g. `correct === true`) is satisfied. Incorrect attempts decrement hearts and remain uncompleted.

### Pattern 4.4: Pseudo-Atomic Sequential Writes
- **Symptoms**: A crash or database error during the second write leaves the first document committed with an incremented version, but subsequent documents (e.g. `KnowledgeMastery`) unchanged. Client retry fails or skips the missing update.
- **Root Cause**: Writing `await repoA.save(); await repoB.save();` sequentially and treating them as an atomic transaction.
- **Fix**: Group all related document mutations inside an explicit datastore transaction (`runTransaction` in Firestore or atomic transaction coordinator). Read all documents inside the transaction, verify version/idempotency against transaction-read data, and commit all writes in a single atomic batch.

### Pattern 4.5: Partial Projection Commit
- **Symptoms**: Reward transaction is recorded and balance updated, but process crashes or errors before `DailyGoal` or `Achievement` updates run. On retry, the reward idempotency check detects `isNew = false` and skips side effects forever, permanently losing goal/achievement progression.
- **Root Cause**: Non-transactional projection side effects guarded by `if (isNew) { doSideEffects(); }`.
- **Fix**: Use Transactional Outbox pattern: Atomically write `RewardTransaction`, `RewardBalance`, and `MotivationEvent` in one transaction. Idempotent projection processor reads `MotivationEvent` and executes projection steps with deterministic projection keys (`proj_${eventId}_${targetId}`), ensuring safe retry and eventual consistency without double-crediting.




