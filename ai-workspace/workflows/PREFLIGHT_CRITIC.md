# LƯỜI OS — Pre-Flight Critic Workflow

> **Execution Point**: Executed AFTER reading task requirements and BEFORE writing any code.  
> **Rule**: The Critic must act skeptically and not merely repeat the implementer's assumptions.

---

## 1. The 13 Critical Pre-Flight Probing Questions

Every task plan must answer these 13 questions explicitly:

1. **What does the server trust?** (Does it rely on a cryptographic signature, database record, or client payload?)
2. **What is client-controlled?** (Is any ID, role, status, or currency amount supplied by the browser?)
3. **What is the authoritative authorization source?** (Firebase Token claims, Firestore profile, or server session?)
4. **Can Tenant A access Tenant B's data?** (What stops Parent A from requesting Child B's records?)
5. **Can resource ownership change?** (Are `parentUid`, `childId`, `studentId` immutable on update?)
6. **Can test-only or mock code reach production?** (Is test verifier/mock provider strictly isolated?)
7. **What happens if environment variables or secrets are missing?** (Does the system fail closed or silently fallback?)
8. **What happens on replay?** (Can an old session token or expired credential be submitted again?)
9. **What happens under concurrent requests?** (Can parallel calls double-spend rewards or create race conditions?)
10. **Can direct URL navigation bypass UI protection?** (What happens if a child types `/parent` in browser bar?)
11. **Can a stale session remain privileged?** (Does changing/resetting PIN invalidate previous session tokens?)
12. **Can the client calculate or forge trusted business state?** (Is reward logic executed purely on the server?)
13. **What happens when the network fails?** (Does local UI state rollback cleanly on persistence error?)
