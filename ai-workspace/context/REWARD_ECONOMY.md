# LƯỜI ENGLISH — Reward Economy & Motivation Engine Summary

> **Scope**: LE-009 Architecture Reference  
> **Rule**: All rewards are server-authoritative, append-only, and idempotent.

## Core Rules:
1. **Four Currencies**: Star ⭐ (Spendable), XP ⚡ (Progression only), Pet Food 🍎 (Companion), Streak 🔥 (Supportive).
2. **Pedagogical Priorities**: Production > Recognition; Spaced Recall > Immediate Recall; Weakness Recovery > Easy Content.
3. **Anti-Grinding**: Diminishing returns (100% $\to$ 50% $\to$ 25% $\to$ 10%) on immediate spam, resetting to 100% when spaced review is legitimately due.
4. **Append-Only Ledger**: Historical transactions are never mutated; idempotency key prevents network retry fraud.
5. **Two-Theme Independence**: 100% theme-agnostic currency calculations.
