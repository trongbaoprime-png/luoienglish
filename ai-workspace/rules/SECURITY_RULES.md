# LƯỜI ENGLISH — Security Rules

1. **Child Data Protection**:
   - Never store PII (full real names, exact addresses, phone numbers) in child profiles.
   - All child records are scoped to parent UID.
2. **Server-Trusted Transactions**:
   - Currency, stars, XP, and inventory modifications are processed exclusively on the server through the `RewardEngine`.
   - Never accept client-submitted coin/star balances.
3. **AI Gateway Isolation**:
   - All AI integrations reside in server routes (`src/app/api/ai/`).
   - API keys are never exposed in browser bundles.
4. **Idempotent State Changes**:
   - Activity completions and reward claims must provide an `idempotencyKey` to prevent duplicate crediting.
