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
