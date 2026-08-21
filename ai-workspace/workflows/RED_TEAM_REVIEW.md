# LƯỜI OS — Adversarial Red Team Review Protocol

> **Mindset**: "There is probably a way to break this implementation. My goal is to find it."  
> **Rule**: For every attack category, mark `PASS` | `FAIL` | `UNKNOWN` | `N/A`. Any critical `FAIL` or `UNKNOWN` blocks task completion.

---

## Adversarial Attack Classes Matrix

| Attack Class | Specific Threat Vector | Test Strategy / Proof | Evaluation |
| :--- | :--- | :--- | :--- |
| **1. Identity Spoofing** | Forging `uid` or `parentUid` in request body | Send manipulated body with valid token | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **2. IDOR** | Accessing victim's child data via guessed childId | Query child records belonging to another parent | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **3. Privilege Escalation** | Setting `role: "admin"` on user profile | Attempt self-promotion via SDK or API | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **4. Cross-Tenant Access** | Listing multi-tenant collections | Run collection query without owner filter | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **5. Session Theft** | Using stolen session cookie from unauth browser | Send session cookie without valid account cookie | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **6. Session Replay** | Replaying valid session after PIN change | Reset PIN and re-submit old session token | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **7. Stale Session** | Using session beyond 15-minute TTL | Submit token with past `expiresAt` | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **8. Race Conditions** | Parallel requests with same idempotency key | Send 10 concurrent claim requests | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **9. Duplicate Requests** | Re-submitting identical reward payload | Send duplicate reward trigger event | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **10. Direct URL Bypass** | Accessing `/parent` without opening PIN modal | Fetch SSR HTML directly via cURL / GET | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **11. Client State Manipulation** | Tampering with `localStorage` or React state | Alter client theme/lock state manually | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **12. Malformed Input** | Non-numeric PIN, huge payload, invalid ISO date | Fuzz API endpoints with malformed JSON | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **13. Missing Environment** | Missing `PARENT_SESSION_SECRET` in prod | Start server without secrets (assert fail-closed) | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **14. Mock Leakage** | `mock_token_*` submitted to production verifier | Send mock token to `FirebaseIdTokenVerifier` | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **15. Secret Fallback** | Signing token with known old fallback secret | Submit token signed with static legacy string | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **16. Reward Fraud** | Direct client SDK write to `rewardBalances` | Call `setDoc()` directly on balance collection | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **17. Rule Bypass** | Altering immutable ownership keys on update | Attempt `updateDoc({ parentUid: "new" })` | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **18. Prompt Injection** | Child prompt jailbreaking AI English tutor | Inject system prompt override in student input | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |
| **19. Learning Evidence Forgery** | Forging `correct=true`, `score=100`, or skipping activities | Submit client-forged attempt or complete with skipped activities | `PASS` / `FAIL` / `UNKNOWN` / `N/A` |

