# LƯỜI OS — Red Team Adversarial Attack Classes Matrix

> **Mandatory Review**: All attack classes must be actively evaluated and verified prior to shipping milestones.

---

## Adversarial Attack Classes

1. **Forged Identity / Token Spoofing**: Client sends crafted `parentUid` or mock tokens.
2. **Stolen Session / Cookie Hijacking**: Attacker uses valid session cookie with another account.
3. **Session Deserialization / Revocation Bypass**: Old session used after credential modification.
4. **Direct Database Client Writes**: Client bypasses backend and attempts direct write to Firestore.
5. **Cross-Tenant IDOR**: Parent A attempts to read or mutate Parent B's child data.
6. **Parent UID Tampering / Profile Hijacking**: Updating child profile while attempting to change `parentUid`.
7. **Client Learning Evidence Forgery (SEC-LEARNING-001)**: Client claims correct answer, score 100, or activity completion directly.
8. **Stale Session Version Replay**: Concurrent or stale learning sessions attempt to overwrite newer state.
9. **Skip-Activity Cheat**: Client claims lesson completion while skipping required exercises.
10. **Duplicate Reward Claim / Replay Attack**: Network retry or parallel requests on same attempt idempotency key.
11. **Non-Atomic Multi-Document Corruption (SEC-LEARNING-002)**: Crash between sequential document writes causing partial state corruption.
12. **Partial Motivation Projection Failure (SEC-REWARD-001)**: Crash after core reward ledger commit leaving Daily Goals or Achievements unrecoverable.
13. **Forged Goal Progress**: Client attempts to submit arbitrary daily goal progress.
14. **Forged Achievement Unlock**: Client attempts to directly mark achievements unlocked.
15. **Streak Forgery & Same-Day Tampering**: Repeated same-day requests attempt to inflate streak counts.
16. **Stale Pre-Transaction Level-Up**: False or missed level-up events due to stale pre-read balance.
17. **Anti-Grinding Bypass**: Immediate repetitive farming of easy content without spaced repetition due date.
18. **Unsafe Error Stack Leakage**: Server errors returning sensitive keys or internal paths.
