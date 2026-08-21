# LƯỜI ENGLISH — Authentication & Parental Gate Architecture (LE-004F Hardened)

> **Security Status**: Phase 1 Foundation Fully Hardened & Account-Bound  
> **Target Audience**: Lead Engineers, Security Reviewers, Compliance Auditors

---

## 1. Core Security Concepts & 4 Distinct Auth States

To guarantee uncompromising child safety, data protection, and isolation against stolen cookie attacks, LƯỜI ENGLISH enforces **four distinct, non-conflated security states**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Firebase Client Auth                                     │
│ "Is the user signed in on the browser?"                     │
│ (Firebase Client SDK Auth State / ID Token)                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Server Account Session (auth_session)                    │
│ "Which authenticated account owns this HTTP request?"       │
│ (HttpOnly Signed Account Session Cookie)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ 3. Scoped Child Session      │ │ 4. Parent Mode Session       │
│ "Which child is learning?"   │ │ "Has that same account       │
│ (Client UX state: childId)   │ │  unlocked parental PIN?"     │
│                              │ │ (15-min HttpOnly session     │
│                              │ │  bound to exact trusted UID) │
└──────────────────────────────┘ └──────────────────────────────┘
```

1. **Firebase Client Auth**: Manages client-side login/logout and token refreshing in the browser.
2. **Server Account Session (`auth_session`)**: Represents the trusted, server-verified identity of the legal guardian for every HTTP request.
3. **Child Session**: Client UX state indicating which child profile (`childId`) is active. Never grants server-level administrative privileges.
4. **Parent Mode Session (`parent_mode_session`)**: A short-lived (15 minutes), server-verified cryptographic token issued **only** after entering the correct Parental PIN.

---

## 2. Cryptographic Account Binding & Route Guard Principle

> [!IMPORTANT]
> **A Parent Mode Session is NEVER sufficient by itself.**  
> Privileged access to `/parent/**` requires BOTH:
> 1. A verified, unexpired **Server Account Session** (`trustedAccountUid`).
> 2. A valid, unexpired **Parent Mode Session** whose `parentUid` cryptographically matches `trustedAccountUid` and whose `securityVersion` matches the account's active `securityVersion`.

### Two-Step Route Authorization Algorithm (`src/app/parent/layout.tsx`)
```typescript
// STEP 1: Verify Server Account Identity
const trustedAccount = verifyServerAccountSession(req);
if (!trustedAccount) {
  redirect("/auth/login?redirect=/parent");
}

// STEP 2: Verify Bound Parent Mode Session
const verification = ParentModeSessionService.verifySession(
  cookie,
  trustedAccount.uid,
  currentSecurityVersion
);

if (!verification.valid) {
  render <ParentUnlockGuard />;
} else {
  render <ParentLayoutContent />;
}
```

### Stolen Cookie Defense
If an attacker obtains only a `parent_mode_session` cookie from Parent A:
- **Case 1 (Attacker is unauthenticated)**: Request lacks `auth_session` $\rightarrow$ Blocked and redirected to login.
- **Case 2 (Attacker is authenticated as Parent B)**: `trustedAccount.uid` is Parent B, but token belongs to Parent A $\rightarrow$ Blocked with `403 Forbidden` (`session.parentUid !== trustedAccount.uid`).

---

## 3. Threat Model & Security Enforcement

| Threat Vector | Mitigation Strategy | Implementation Details |
| :--- | :--- | :--- |
| **Stolen Parent Mode Cookie** | Account Binding Requirement | Parent Mode session is strictly bound to `auth_session` UID. |
| **Plaintext PIN Persistence** | PBKDF2 Hashing | Server-side PBKDF2-HMAC-SHA256 with **100,000 iterations** & 16-byte salt. |
| **Brute-Force PIN Attacks** | Rate Limiting & Lockout | Maximum 5 consecutive failed attempts before a 5-minute temporary lockout. |
| **Default PIN Exploits** | Zero Default PIN Policy | New accounts have `isPinSet: false`. Unlocking requires explicit PIN setup. |
| **Replay Attacks After PIN Change** | Stateful Invalidation | Resetting or changing PIN increments `securityVersion`, instantly invalidating previous sessions. |
| **Mock Token Forgery** | Fail-Closed Production Verifier | Production runtime strictly rejects `mock_token_*` with `401`. |
