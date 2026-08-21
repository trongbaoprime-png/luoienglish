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
