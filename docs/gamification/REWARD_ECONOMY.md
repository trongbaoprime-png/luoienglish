# LƯỜI ENGLISH — Reward Economy & Motivation Engine Architecture

> **Version**: 1.0.0 (LE-009)  
> **Components**: `RewardPolicy`, `DiminishingReturnsPolicy`, `LevelPolicy`, `AchievementPolicy`, `DailyGoalPolicy`, `RewardService`, `RewardPresentation`  

---

## 1. Core Economy & Currencies

| Currency / Resource | Purpose | Spendable? | Earned Through |
| :--- | :--- | :--- | :--- |
| **⭐ Star** | Primary learning currency for cosmetics, accessories, collections. | YES | Lessons, spaced review, speaking accuracy, daily goals. |
| **⚡ XP** | Learner level progression & milestone badges. | NO | All verified learning activities, weighted by quality and difficulty. |
| **🍎 Pet Food** | Nurture resource for Chú Lười companion (*"Con học $\to$ Chú Lười lớn lên"*). | YES | Meaningful completions, review sessions, weakness recovery. |
| **🔥 Streak** | Supportive consistency tracker. | NO | Consecutive days of learning (non-punitive). |

---

## 2. Reward Formula & Pedagogical Multipliers

All rewards originate from server-evaluated `LearningEvidence`:

$$\text{Reward} = \text{Base} \times M_{\text{skill}} \times M_{\text{spacing}} \times M_{\text{quality}} \times M_{\text{anti-grinding}} + \text{Bonus}_{\text{weakness}}$$

### Multiplier Tiers:
- **Skill Multiplier ($M_{\text{skill}}$)**:
  - `vocabulary` (recognition): $1.0\times$
  - `listening` / `reading`: $1.2\times$
  - `writing` / `sentence_builder`: $1.5\times$
  - `speaking` / `pronunciation`: $1.8\times$
  - `conversation` / `scenario_transfer`: $2.0\times$
- **Spacing Multiplier ($M_{\text{spacing}}$)**:
  - Same session: $1.0\times$
  - 1–3 days: $1.25\times$
  - 4–7 days: $1.5\times$
  - 8–14 days: $2.0\times$
  - 30+ days (durable mastery): $3.0\times$
- **Quality Multiplier ($M_{\text{quality}}$)**:
  - $\ge 90\%$ accuracy: $1.2\times$
- **Weakness Recovery Bonus**:
  - $+2$ Stars, $+35$ XP, $+2$ Pet Food when recovering a flagged weakness.

---

## 3. Anti-Grinding & Diminishing Returns

To prevent farming trivial exercises while protecting genuine spaced repetition:
- **Immediate Repetitions**:
  - 1st attempt: $100\%$
  - 2nd repetition in 24h: $50\%$
  - 3rd repetition in 24h: $25\%$
  - 4th+ repetition: $10\%$ floor
- **Spaced Repetition Reset**:
  - When an item becomes legitimately due for review (`nextReviewAt` reached), the anti-grinding multiplier **immediately resets to $100\%$**.

---

## 4. Append-Only Ledger & Idempotency

- Every transaction is appended to `rewardTransactions` with deterministic `idempotencyKey` (e.g. `reward_review_{sessionId}_{attemptId}`).
- Replaying or retrying an attempt returns the cached balance with `isNew: false`, guaranteeing zero duplicate credits.
