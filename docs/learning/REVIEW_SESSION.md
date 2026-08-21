# LƯỜI ENGLISH — Adaptive Review Session & Trust Architecture

> **Version**: 1.1.0 (LE-008C)  
> **Component**: `ReviewSession`, `DailyReviewService`, `ReviewSessionPlanner`, `IReviewAttemptTransactionRepository`  

---

## 1. Interleaved Session Architecture

Instead of reviewing homogeneous blocks of one word or one skill, `ReviewSessionPlanner` constructs an interleaved session:
- **40% Overdue / Forgetting Risk Items**
- **30% Weak Skill Remediation**
- **20% Prerequisite / Foundation Reinforcement**
- **10% Recent Successful Knowledge (Confidence Anchors)**

```
┌─────────────────────────────────────────────────────────────┐
│                 Interleaved Review Sequence                 │
├────────────┬─────────────┬─────────────────┬────────────────┤
│ Position   │ Reason      │ Target Skill    │ Activity Type  │
├────────────┼─────────────┼─────────────────┼────────────────┤
│ Item 1     │ OVERDUE     │ vocabulary      │ flashcard      │
│ Item 2     │ WEAK_SKILL  │ speaking        │ speak_aloud    │
│ Item 3     │ PREREQ_GAP  │ listening       │ listen_choose  │
│ Item 4     │ FORGET_RISK │ communication   │ mini_dialogue  │
└────────────┴─────────────┴─────────────────┴────────────────┘
```

---

## 2. Server Trust Boundary & Anti-Cheat

In compliance with `SEC-LEARNING-001`:
1. The **server creates and signs** the `ReviewSession` document and its dynamic `Activity[]`.
2. The **client submits only raw answers** (`POST /api/learning/review/session/[sessionId]/attempt`).
3. The **server evaluates correctness** using `ActivityEvaluatorFactory`, records `LearningEvidence`, updates `KnowledgeMastery`, and awards stars/XP idempotently.
4. **Telemetry Sanitization**: Client latency and hint counts are treated as low-trust metrics and clamped on the server (`500ms <= responseTimeMs <= 30000ms`, `0 <= hintsUsed <= 10`).

---

## 3. True Datastore Atomic Transactions (LE-008C / SEC-LEARNING-002)

Sequential awaited writes (`await saveSession(); await saveMastery();`) are strictly banned for learning mutations.

Every attempt is executed inside a single datastore transaction (`runTransaction` in Firestore / `IReviewAttemptTransactionRepository`):
1. **Transactional Reads**: `ReviewSession` and `KnowledgeMastery` are read inside the datastore transaction.
2. **In-Transaction Concurrency Gate**: Verifies `session.version === expectedVersion`.
3. **In-Transaction Idempotency Gate**: Checks `attemptKey` against session evidence. Repeated requests return cached results with zero writes.
4. **All-or-Nothing Commit**: Both `ReviewSession` (with new version and evidence) and `KnowledgeMastery` (with updated multidimensional scores) commit atomically. If any error or crash occurs, ZERO partial mutations are committed.
