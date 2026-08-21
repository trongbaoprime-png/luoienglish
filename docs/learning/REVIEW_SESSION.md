# LƯỜI ENGLISH — Adaptive Review Session & Trust Architecture

> **Version**: 1.0.0 (LE-008)  
> **Component**: `ReviewSession`, `DailyReviewService`, `ReviewSessionPlanner`  

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

## 2. Server Trust Boundary

In compliance with `SEC-LEARNING-001`:
1. The **server creates and signs** the `ReviewSession` document and its dynamic `Activity[]`.
2. The **client submits only raw answers** (`POST /api/learning/review/session/[sessionId]/attempt`).
3. The **server evaluates correctness** using `ActivityEvaluatorFactory`, records `LearningEvidence`, updates `KnowledgeMastery`, and awards stars/XP idempotently.
