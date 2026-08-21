# LƯỜI ENGLISH — Authentication & Parental Gate Architecture

> **Security Status**: Phase 1 Foundation  
> **Target Audience**: Lead Engineers, Security Reviewers, Compliance Auditors

---

## 1. Authentication Architecture

LƯỜI ENGLISH implements a secure, modular authentication architecture leveraging Firebase Authentication with extensible adapters.

### Authentication Providers
- **Email + Password**: Standard registration, login, and password reset flows with client error translation.
- **Google Sign-In**: Single-click OAuth popup provider with profile synchronization.
- **Extensible Design**: `IAuthService` allows straightforward addition of Apple Sign-In or phone OTP in future releases.

### User Profile (`users/{uid}`)
```typescript
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "parent" | "admin";
  preferences: {
    language: "vi" | "en";
    notifications: boolean;
  };
  isPinSet: boolean;
  createdAt: string;
  updatedAt: string;
}
```
*Note*: No unnecessary personal information or sensitive plaintext credentials are ever stored.

---

## 2. Parent / Child Boundary & Scoped Child Sessions

### Core Principle
Children (ages 6–15) **DO NOT** receive independent Firebase authentication credentials.
1. The Parent authenticates via Firebase Auth.
2. The Parent enters the Parent Dashboard (`/parent`).
3. The Parent selects a child profile to initiate a **Scoped Child Session**:
   ```typescript
   export interface ChildSession {
     parentUid: string;
     childId: string;
     startedAt: string;
   }
   ```
4. The application transitions into **Child Mode** (`/home`, `/learn`, `/adventure-map`, etc.).
5. In Child Mode, the UI restricts all access strictly to data belonging to `childSession.childId`.

### Returning to Parent Mode (Parental Gate)
- When a child clicks "Phụ Huynh" in the navigation bar, the application triggers the `ParentalGateModal`.
- The parent must enter their 4–6 digit Parental PIN.
- Only upon successful verification does the application navigate to `/parent`.

---

## 3. Parental PIN Threat Model & Security Controls

| Threat Vector | Mitigation Strategy | Implementation |
| :--- | :--- | :--- |
| **Plaintext PIN Exposure** | PIN is never stored or transmitted in plaintext. | Server-side PBKDF2 hashing with 10,000 iterations and 16-byte random salt. |
| **Client-Side Bypass** | Verification is evaluated on the server runtime (`/api/auth/pin`). | PIN hash and salt reside in isolated `parentSecurity/{uid}` with `allow read, write: if false` on the client. |
| **Brute-Force Attacks** | Maximum 5 consecutive failed attempts before temporary lockout. | Locked for 5 minutes (`lockedUntil` timestamp) upon 5th failure. |
| **Session Hijacking** | Child Mode cannot modify PIN or account settings. | Settings and PIN reset flows require authenticated parent session and PIN verification. |

---

## 4. Authorization & Firestore Security Enforcement

Authentication does NOT equal Authorization. All data access is strictly gated at the Firestore database layer:
- **`children/{childId}`**: Parent can access only owned children (`parentUid == request.auth.uid`). `parentUid` is immutable.
- **`studentProgress` & `knowledgeMastery`**: Requires `isParentOfChild(childId)` and immutable child/student IDs on update.
- **`pets`**: Read/write authorization derived strictly from `isParentOfChild(resource.data.childId)`.
- **`rewardTransactions` & `rewardBalances`**: Direct client write is blocked (`allow write: if false`). Read is restricted to owning parent.
- **`curricula`**: Publicly readable for authenticated users; write gated strictly to `role == 'admin'`.

---

## 5. Known Limitations & Future Roadmap
1. **Child Session Tokens**: Child sessions currently operate as scoped client state verified through parent Firebase Auth tokens. Future phases will introduce short-lived scoped custom JWTs for independent student device installations.
2. **Biometric Unlock**: Future mobile apps will wrap the Parental PIN with FaceID / TouchID biometric prompts.
3. **Audit Logging**: An administrative audit log will track parental PIN changes and security lockouts.
