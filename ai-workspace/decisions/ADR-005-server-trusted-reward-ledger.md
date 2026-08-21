# ADR-005: Server-Trusted Reward Ledger & Anti-Cheat

## Status: Accepted

## Context
Gamification (Stars, XP, Coins, Pet Food) is central to student engagement. Storing raw currency values directly on the client allows trivial client-side tampering.

## Decision
All rewards are managed via an append-only `rewardLedger` managed server-side by the `RewardEngine`. The client sends learning achievement events; the server calculates rewards, checks idempotency, and commits transactions.

## Consequences
- Impossible to manipulate currency by modifying client storage.
- Full audit history of every star and XP point earned.
- Enables dynamic reward adjustments (e.g. boosting rewards for difficult spaced-repetition recalls).
