# LƯỜI ENGLISH — Security Lessons & Hardened Patterns

> **Knowledge Classification**: Core Security Wisdom & Post-Mortem Records  
> **Applicability**: All backend APIs, route guards, auth adapters, and Firestore rules

---

## 1. The 4 Distinct Security States (Never Conflate)

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
│ (HttpOnly Signed Account Session Cookie, 24h TTL)           │
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

- **Lesson 1.1**: **Client UI state is NEVER authorization**. Having `isPinSet: true` or `isUnlocked: true` in React state or localStorage provides zero authorization evidence to the server.
- **Lesson 1.2**: **Parent Mode Session is NEVER sufficient alone**. A `parent_mode_session` cookie must be cryptographically bound to a verified `auth_session` account. If an attacker steals Parent A's PIN session cookie and presents it from an unauthenticated browser or Parent B's account, it must be rejected with 401/403.
- **Lesson 1.3**: **Child Session is strictly unprivileged**. A child session only selects the active UI profile (`childId`, theme, mascot avatar). It cannot mutate billing, account settings, reward ledgers, or access other children's data.

---

## 2. Server Identity: Never Trust Client Request Bodies

- **Rule**: Every protected server endpoint (`/api/**`) must derive caller identity (`trustedUid`, `role`) strictly from `verifyFirebaseIdToken(req)` or `verifyServerAccountSession(req)`.
- **Anti-Pattern**:
  ```typescript
  // VULNERABLE: Client can forge parentUid in JSON body
  const { parentUid, pin } = await req.json();
  ```
- **Hardened Pattern**:
  ```typescript
  // SECURE: Derived from verified cryptographic token
  const verifiedToken = await verifyFirebaseIdToken(req);
  const trustedParentUid = verifiedToken.uid;
  ```

---

## 3. Stateful Session Invalidation (`securityVersion`)

- **Lesson**: Stateless HMAC tokens cannot be revoked early without state.
- **Hardened Pattern**:
  1. Every `UserProfile` and `PinRecord` maintains an integer `securityVersion`.
  2. The `ParentModeSession` payload includes `sessionVersion: number`.
  3. When verifying a session on the server: `session.securityVersion === currentSecurityVersion`.
  4. When a parent **changes** or **resets** their PIN, `securityVersion` increments immediately.
  5. Any previously issued session token instantly becomes invalid across all devices.

---

## 4. Cryptographic Standards for Parental Gate

| Parameter | Specification | Rationale |
| :--- | :--- | :--- |
| **Algorithm** | `PBKDF2-HMAC-SHA256` | Standard resistant to GPU/ASIC acceleration |
| **Iterations** | `100,000` | Sufficient computational cost for 4–6 digit PINs |
| **Salt** | `16 bytes` (32 hex chars) | Random cryptographic salt per account |
| **Comparison** | `crypto.timingSafeEqual` | Eliminates timing side-channel attacks |
| **Rate Limiting** | Max 5 consecutive failures | Triggers mandatory 5-minute lockout |
| **Plaintext Storage** | **STRICTLY ZERO** | Plaintext PIN is never stored or logged |

---

## 5. Fail-Closed Secret Configuration

- **Lesson**: Hard-coded fallback secrets (`"secret_key_123"`) will inevitably leak into production or staging environments.
- **Rule**: If `PARENT_SESSION_SECRET` is missing or `< 32 characters` in non-test runtime:
  - Throw `ServerAuthError(500)` immediately.
  - Refuse to issue or verify any session.
  - Never allow silent fallback to insecure defaults.

---

## 6. Zero Default PIN Policy

- **Lesson**: Demo PINs (like `"1234"`) left in production UI or backend mocks allow children or malicious actors to bypass parental controls.
- **Rule**:
  - New accounts start with `isPinSet: false`.
  - The UI must render a dedicated "Initial PIN Setup" flow instead of an unlock pad.
  - "1234" must return `401 Unauthorized` / `"Chưa thiết lập mã PIN"` unless explicitly configured by the parent.

---

## 7. Multi-Tenant Firestore Ownership & Immutable Fields

- **Rule 1**: Every child-owned resource (`studentProgress`, `knowledgeMastery`, `pets`, `rewardBalances`, `rewardTransactions`) must verify parent ownership via `isParentOfChild(childId)`:
  ```
  function isParentOfChild(childId) {
    return isAuthenticated() &&
      get(/databases/(default)/documents/children/$(childId)).data.parentUid == request.auth.uid;
  }
  ```
- **Rule 2**: On document `update`, ownership fields (`childId`, `studentId`, `parentUid`) must be strictly immutable:
  ```
  allow update: if isParentOfChild(resource.data.childId) &&
                   request.resource.data.childId == resource.data.childId;
  ```
- **Rule 3**: `rewardBalances` and `rewardTransactions` must enforce `allow write: if false;` for untrusted client SDKs. All ledger mutations occur through atomic server transactions.
