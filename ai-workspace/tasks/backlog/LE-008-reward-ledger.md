# Task Contract: LE-008 — Server-Trusted Reward Ledger

- **Task ID**: `LE-008`
- **Goal**: Implement server-side reward credit transactions with anti-cheat idempotency and ledger audit log.
- **Risk Level**: `R2 Data/Architecture`
- **Acceptance Criteria**:
  1. Append-only transaction log in Firestore.
  2. Idempotency key deduplication.
  3. Real-time balance derivation (Stars, XP, Coins, Pet Food).
