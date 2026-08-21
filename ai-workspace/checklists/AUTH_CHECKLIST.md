# LƯỜI ENGLISH — Authentication & Authorization Checklist

> **Mandatory Gate**: Use before merging any PR modifying auth, sessions, PIN, or parent routes.

---

## 1. Server-Side Identity Verification
- [ ] Endpoint derives `trustedParentUid` strictly from `verifyFirebaseIdToken(req)` or `verifyServerAccountSession(req)`.
- [ ] No `parentUid`, `uid`, or `role` from the JSON request body is trusted.
- [ ] `FirebaseIdTokenVerifier` strictly rejects `mock_token_*` with `401 Unauthorized` in non-test runtime.

## 2. Parent Mode Session & Parental Gate
- [ ] `ParentModeSession` requires verified `auth_session` account matching `session.parentUid`.
- [ ] HMAC signature verified with `PARENT_SESSION_SECRET` (>= 32 chars).
- [ ] Expiry TTL strictly enforced (<= 15 minutes).
- [ ] Temporal validation rejects future timestamps (`createdAt > now + clockSkew`).
- [ ] `session.securityVersion === currentSecurityVersion` from database.
- [ ] PIN reset / change immediately increments `securityVersion`.

## 3. PIN Security Standards
- [ ] PBKDF2 uses **100,000 iterations**, `HMAC-SHA256`, and random 16-byte salt.
- [ ] PIN is NEVER stored, transmitted, or logged in plaintext.
- [ ] Verification uses `crypto.timingSafeEqual` for constant-time comparison.
- [ ] Failed attempt counter rate-limits and locks account for 5 minutes after 5 failures.
- [ ] Zero default PIN ("1234") hard-coded in code or UI.

## 4. Route & Layout Protection
- [ ] `/parent/**` protected by Server Component layout (`src/app/parent/layout.tsx`).
- [ ] Direct navigation without valid session renders `<ParentUnlockGuard />`.
- [ ] Zero privileged metrics or child profiles leaked via SSR HTML.
