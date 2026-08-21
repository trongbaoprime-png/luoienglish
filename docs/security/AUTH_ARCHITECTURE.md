# LƯỜI ENGLISH — Authentication & Parental Gate Architecture (LE-004C Hardened)

> **Security Status**: Phase 1 Foundation Hardened  
> **Target Audience**: Lead Engineers, Security Reviewers, Compliance Auditors

---

## 1. Core Security Concepts & Triple-Boundary Architecture

To ensure strict child safety, LƯỜI ENGLISH formalizes **three distinct, non-conflated security boundaries**:

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
│                              │ │  cookie / token)             │
└──────────────────────────────┘ └──────────────────────────────┘
```

1. **Firebase Authentication**: Identifies the legal guardian account (`uid`, `email`, `role`). Remains active in the background.
2. **Child Session**: Client UX state indicating which child profile (`childId`) is currently active on the learning screens. Does **not** grant server-level administrative privileges.
3. **Parent Mode Session**: A short-lived (15 minutes), server-verified, cryptographic session created **only** after entering the correct Parental PIN. Privileged parental settings and PIN mutations require this active session.

---

## 2. Verified Server Identity Enforcement & Zero Mock Backdoor

- `verifyFirebaseIdToken(request)` uses `FirebaseIdTokenVerifier` in production runtime.
- Mock tokens (`mock_token_*`) are **strictly prohibited and rejected with 401** in production environments. Mock token verification is exclusively isolated within `TestIdTokenVerifier` for automated unit test suites.
- Identity is derived strictly from verified cryptographic tokens in the `Authorization: Bearer <token>` header. Request body `parentUid` is ignored and overridden by server identity.

---

## 3. Parent Mode Session & Parental Gate Security

### Session Lifecycle
1. Parent authenticates with Firebase Auth.
2. App defaults to **Child Mode** or prompts for PIN.
3. Parent enters PIN $\rightarrow$ Server executes PBKDF2 verification $\rightarrow$ Upon success, server issues an HMAC-SHA256 signed `ParentModeSession` token inside a secure, `HttpOnly`, `SameSite=Lax`, `Path=/`, 15-minute cookie (`parent_mode_session`).
4. Protected Parent operations (`/parent`, PIN change, PIN reset) require `verifyParentModeSession(req, parentUid)`.
5. Switching back to Child Mode calls `/api/auth/pin` with `{ action: "lock" }`, which immediately deletes the session cookie.
6. Logging out clears both the Firebase Auth state and the Parent Mode Session cookie.

---

## 4. Parental PIN Threat Model & Cryptographic Hardening

| Threat Vector | Mitigation Strategy | Implementation Details |
| :--- | :--- | :--- |
| **Plaintext PIN Persistence** | PIN is never persisted in plaintext. | Server-side PBKDF2-HMAC-SHA256 with **100,000 iterations** and 16-byte random salt. |
| **Transport Security** | Protected in transit via TLS / HTTPS. | Plaintext PIN travels only within the encrypted HTTPS payload. |
| **Child Mode Privilege Bypass** | Privileged actions require active ParentModeSession. | Child Mode cannot reset/modify PIN without active 15-minute PIN unlock session. |
| **Brute-Force Attacks** | Rate-limited attempt counter and lockout. | Maximum 5 consecutive failed attempts before a mandatory 5-minute temporary lockout. |
| **Direct Database Access / Leakage** | PIN records isolated from client queries. | `parentSecurity/{uid}` has `allow read, write: if false` on the client. |
| **Privilege Escalation** | `users/{uid}` role is locked in Firestore rules. | `create` requires `role == 'parent'`; `update` enforces immutable `role`, `uid`, and `email`. |

---

## 5. Firestore Multi-Tenant Security Rules Summary

- **`users/{uid}`**: Normal parents cannot mutate `role` or reassign `uid`/`email`.
- **`parentSecurity/{uid}`**: Closed to all client reads and writes (`allow read, write: if false`).
- **`children/{childId}`**: Accessible only by owning parent (`parentUid == request.auth.uid`). `parentUid` is strictly immutable.
- **`studentProgress`, `knowledgeMastery`, `pets`**: Strictly gated via `isParentOfChild(childId)` with immutable IDs on update.
- **`rewardBalances`, `rewardTransactions`**: Client write = false; client read gated to owning parent.
