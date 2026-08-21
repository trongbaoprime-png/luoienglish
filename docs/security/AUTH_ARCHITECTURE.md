# LƯỜI ENGLISH — Authentication & Parental Gate Architecture (LE-004E Hardened)

> **Security Status**: Phase 1 Foundation Fully Hardened  
> **Target Audience**: Lead Engineers, Security Reviewers, Compliance Auditors

---

## 1. Core Security Concepts & Triple-Boundary Architecture

To guarantee uncompromising child safety and data protection, LƯỜI ENGLISH enforces **three distinct, non-conflated security boundaries**:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Firebase Authentication                                  │
│ "Who owns the account?"                                     │
│ (Firebase ID Token: uid, email, role)                       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
┌──────────────────────────────┐ ┌──────────────────────────────┐
│ 2. Scoped Child Session      │ │ 3. Parent Mode Session       │
│ "Which child is learning?"   │ │ "Has an adult unlocked PIN?" │
│ (Client UX state: childId)   │ │ (15-min HttpOnly signed      │
│                              │ │  cookie + cryptographic      │
│                              │ │  server verification)        │
└──────────────────────────────┘ └──────────────────────────────┘
```

1. **Firebase Authentication**: Identifies the legal guardian account (`uid`, `email`, `role`).
2. **Child Session**: Client UX state indicating which child profile (`childId`) is active. Does **not** grant server-level administrative privileges.
3. **Parent Mode Session**: A short-lived (15 minutes), server-verified, cryptographic session created **only** after entering the correct Parental PIN.

---

## 2. Cryptographic Route Authorization Principle

> [!IMPORTANT]
> **Cookie presence is NOT authorization.**  
> Simply sending a cookie named `parent_mode_session` does not grant access. A session token is valid authorization evidence **only** when it passes full server-side cryptographic verification bound to the verified parent identity and active `securityVersion`.

### Server-Side Route Guard (`/parent/**`)
Before rendering any privileged parental content or metrics in SSR, `src/app/parent/layout.tsx` verifies:
1. **Signature Verification**: Valid HMAC-SHA256 digest using server-only `PARENT_SESSION_SECRET`.
2. **Temporal Validity**: Valid ISO timestamps, rejection of future-created tokens and expired TTL.
3. **Ownership Binding**: `session.parentUid === request.parentUid`.
4. **Stateful Invalidation**: `session.securityVersion === currentSecurityVersion` from database.

If any check fails, the server renders the `<ParentUnlockGuard />`, ensuring **0% data leakage via SSR HTML**.

---

## 3. Zero Default PIN & Fail-Closed Policies

- **Zero Hard-Coded PIN**: There is no default PIN (such as "1234"). New parent accounts start with `isPinSet: false`. Unlocking requires the parent to set an explicit 4–6 digit PIN through the authenticated setup flow.
- **Fail-Closed Secret**: If `PARENT_SESSION_SECRET` is missing or shorter than 32 characters in production, the server fails closed (`500 ServerAuthError`), refusing to issue or verify any session.
- **Stateful Invalidation on PIN Change / Reset**: Changing or resetting the PIN increments `securityVersion`, instantly invalidating all previously issued session tokens.
- **Zero Mock Token in Production**: `FirebaseIdTokenVerifier` in production runtime rejects all mock tokens with `401`.

---

## 4. Parental PIN Threat Model & Cryptographic Hardening

| Threat Vector | Mitigation Strategy | Implementation Details |
| :--- | :--- | :--- |
| **Plaintext PIN Persistence** | PIN is never persisted in plaintext. | Server-side PBKDF2-HMAC-SHA256 with **100,000 iterations** and 16-byte random salt. |
| **Transport Security** | Protected in transit via TLS / HTTPS. | Plaintext PIN travels only within the encrypted HTTPS payload. |
| **Child Mode Direct URL Bypass** | Server Component layout guard checks cryptographic session. | Accessing `/parent` from Child Mode renders locked PIN pad on server. |
| **Brute-Force Attacks** | Rate-limited attempt counter and lockout. | Maximum 5 consecutive failed attempts before a mandatory 5-minute temporary lockout. |
| **Privilege Escalation** | `users/{uid}` role is locked in Firestore rules. | `create` requires `role == 'parent'`; `update` enforces immutable `role`, `uid`, and `email`. |
