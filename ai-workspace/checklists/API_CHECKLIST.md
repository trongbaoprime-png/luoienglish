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
- [ ] Concurrency checks (`storedSession.version == expectedVersion`) MUST execute BEFORE performing any side-effects on `KnowledgeMastery`, `RewardRepository`, or `StudentProgress`.
- [ ] Attempt idempotency keys (`sessionId_activityId_v{version}` or client `attemptId`) are checked to prevent double mastery/reward mutations on network retries.
- [ ] Session updates, evidence appends, and mastery updates are committed atomically. A concurrency failure (`409 Conflict`) leaves zero partial mutations in memory or database.
- [ ] An activity/item is marked `completed: true` ONLY when the child's answer is evaluated as `correct === true` (never conflate "attempted" with "completed").

