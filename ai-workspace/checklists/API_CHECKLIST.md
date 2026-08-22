# LƯỜI ENGLISH — Server API & Route Handler Checklist

> **Mandatory Gate**: Use before shipping any Next.js Route Handler (`src/app/api/**`).

---

## 1. Authentication & Identity Derivation
- [ ] Route Handler calls `verifyFirebaseIdToken(req)` or `verifyServerAccountSession(req)`.
- [ ] Caller identity (`trustedUid`) is strictly derived from token/cookie.
- [ ] If mutating child data, `authorizeChildAccess(trustedUid, childId, childRepo)` verifies ownership.

## 2. Input Validation & Error Handling
- [ ] Request body is parsed with fallback `.catch(() => ({}))`.
- [ ] All input fields are validated for type, format, and range (e.g. PIN is `/^\d{4,6}$/`).
- [ ] Standard HTTP status codes used:
  - `400 Bad Request`: Malformed or missing parameters.
  - `401 Unauthorized`: Missing or invalid auth token / session.
  - `403 Forbidden`: Account does not own target resource.
  - `404 Not Found`: Resource does not exist.
  - `500 Internal Server Error`: Unhandled server exception.

## 3. Data Leakage Prevention
- [ ] Password hashes, salts, internal session secrets, or raw exception stack traces are NEVER returned in JSON responses.
- [ ] Sensitive cookies (`auth_session`, `parent_mode_session`) have `httpOnly: true`, `secure: true` (in prod), `sameSite: "lax"`, and appropriate `maxAge`.

## 4. Learning & Reward Evidence Trust Boundary (SEC-LEARNING-001)
- [ ] Any client-derived field affecting reward, mastery, progress, completion, entitlement, or privileges is NEVER trusted blindly.
- [ ] Attempts accept only raw input data; server evaluates correctness, score, and skill dimensions.
- [ ] Rewards and completions are verified against authoritative server session state and committed idempotently.

## 5. Atomic Learning Transactions & Concurrency Checks (SEC-LEARNING-002)
- [ ] Are all authoritative documents (`ReviewSession` + `KnowledgeMastery`) mutated through ONE datastore transaction (`runTransaction`)?
- [ ] Are concurrency/version (`storedSession.version == expectedVersion`) and attempt idempotency checks evaluated INSIDE that transaction?
- [ ] Are all source records used to calculate mutations read INSIDE the same transaction to prevent lost updates?
- [ ] A concurrency failure (`409 Conflict`) or simulated pre-commit error leaves ZERO partial mutations in memory or datastore.
- [ ] An activity/item is marked `completed: true` ONLY when the child's answer is evaluated as `correct === true` (never conflate "attempted" with "completed").
- [ ] Low-trust client telemetry (`responseTimeMs`, `hintsUsed`) is sanitized and clamped on the server before calculating evidence or mastery.

## 6. Motivation Outbox & Projection Idempotency (SEC-REWARD-001 & SEC-REWARD-002)
- [ ] Are `RewardTransaction`, `RewardBalance`, and `MotivationEvent` (outbox) committed inside ONE atomic datastore transaction?
- [ ] Is projection idempotency marker checked INSIDE the same transaction that mutates the aggregate (`applyProjection`)?
- [ ] Are aggregate mutation and projection marker written atomically in the same commit?
- [ ] Is check-then-mutate race condition prevented (can two concurrent workers both observe "not processed")?
- [ ] Does level transition use transaction-derived delta (`previousLevel` vs `newLevel`) rather than a stale pre-transaction read?
- [ ] Can an uncompleted or interrupted projection be cleanly replayed/recovered on retry without duplicate reward credits?




