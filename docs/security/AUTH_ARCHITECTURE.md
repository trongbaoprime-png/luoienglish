# LƯỜI ENGLISH — Authentication & Parental Gate Architecture (LE-004B Hardened)

> **Security Status**: Phase 1 Foundation Hardened  
> **Target Audience**: Lead Engineers, Security Reviewers, Compliance Auditors

---

## 1. Verified Server Identity Enforcement

All protected server endpoints (e.g. `/api/auth/pin`) **NEVER** trust client-supplied identity fields (`parentUid`, `uid`, `role`) in the request body.

### Server Token Verification (`verifyFirebaseIdToken`)
Identity is derived strictly from a verified Firebase ID Token passed in the `Authorization: Bearer <token>` header:
```typescript
const verifiedToken = await verifyFirebaseIdToken(req);
const trustedParentUid = verifiedToken.uid;
```
- Missing / malformed / expired tokens result in a safe `401 Unauthorized` response without exposing internal server error stacks.
- Any `parentUid` passed in request payloads is discarded and overridden by `verifiedToken.uid`.

---

## 2. Server-Side Child Access Authorization (`authorizeChildAccess`)

Client `ChildSession` is strictly a UX helper for child-friendly screen presentation. It does **not** grant authorization on the server.

Whenever a server API route interacts with child data:
1. Verify the parent ID token $\rightarrow$ obtain `trustedParentUid`.
2. Call `authorizeChildAccess(trustedParentUid, childId, childRepo)`.
3. The server queries `children/{childId}` and verifies `child.parentUid === trustedParentUid`.
4. If unauthorized, the API immediately halts with `403 Forbidden`.

---

## 3. Parental PIN Threat Model & Security Controls

| Threat Vector | Mitigation Strategy | Implementation Details |
| :--- | :--- | :--- |
| **Plaintext PIN Persistence** | PIN is never persisted in plaintext. | Server-side PBKDF2 hashing with 10,000 iterations and 16-byte random salt. |
| **Transport Security** | Protected in transit via TLS / HTTPS. | Plaintext PIN travels only within the encrypted HTTPS payload. |
| **Client-Side Identity Forgery** | Server identity derived strictly from ID token. | `/api/auth/pin` operates exclusively on `verifiedToken.uid`. |
| **Direct Database Access / Leakage** | PIN records isolated from client queries. | `parentSecurity/{uid}` has `allow read, write: if false` on the client. Accessible only via Server Admin SDK. |
| **Brute-Force Attacks** | Rate-limited attempt counter and lockout. | Maximum 5 consecutive failed attempts before a mandatory 5-minute temporary lockout. |
| **Privilege Escalation** | `users/{uid}` role is locked in Firestore rules. | `create` requires `role == 'parent'`; `update` enforces `request.resource.data.role == resource.data.role`. |

---

## 4. Firestore Multi-Tenant Security Rules Summary

- **`users/{uid}`**: Normal parents cannot mutate `role` or reassign `uid`/`email`.
- **`parentSecurity/{uid}`**: Closed to all client reads and writes (`allow read, write: if false`).
- **`children/{childId}`**: Accessible only by owning parent (`parentUid == request.auth.uid`). `parentUid` is strictly immutable.
- **`studentProgress`, `knowledgeMastery`, `pets`**: Strictly gated via `isParentOfChild(childId)` with immutable IDs on update.
- **`rewardBalances`, `rewardTransactions`**: Client write = false; client read gated to owning parent.

---

## 5. Known Limitations & Roadmap
1. **Biometric Integration**: Future mobile versions (iOS/Android) will wrap the Parental PIN with biometric prompts (FaceID / TouchID / BiometricPrompt).
2. **Audit Trails**: Security lockouts and PIN changes will be streamed to an administrative security event ledger.
