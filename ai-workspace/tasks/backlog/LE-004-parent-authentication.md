# Task Contract: LE-004 — Parent Authentication & Parental Gate

- **Task ID**: `LE-004`
- **Goal**: Implement production-oriented Firebase Authentication foundation (Email/Password + Google Sign-In), Parent Profile management, Scoped Child Session management, and Parental Gate (PIN with server-side PBKDF2 hashing, rate limiting, and brute-force lockout).
- **Risk Level**: `R3 Security/Auth`
- **Context Required**: `docs/security/AUTH_ARCHITECTURE.md`, `docs/security/CHILD_SAFETY.md`, `firestore.rules`
- **Files Allowed**: `src/types/auth.ts`, `src/services/auth/`, `src/lib/auth/`, `src/components/auth/`, `src/app/auth/`, `src/app/api/auth/`, `src/repositories/`

## Acceptance Criteria
1. **Authentication**: Email/Password and Google Sign-in with human-friendly Vietnamese error handling.
2. **Parent Profile**: `users/{uid}` created/synchronized cleanly without sensitive plaintext credentials.
3. **Parental Gate**: 4–6 digit PIN hashed server-side with salt, rate limited (5 max attempts), and temporary 5-minute lockout.
4. **Child Session**: Scoped session (`parentUid`, `childId`, `startedAt`) allowing kids to study safely while requiring PIN verification to re-enter Parent Mode.
5. **Security Tests**: All 30+ unit, auth, PIN, and security rules test cases passing cleanly.
6. **Validation**: Typecheck, Lint, Tests, and Build pass with 0 errors.
