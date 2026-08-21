# LƯỜI ENGLISH — Interactive Learning Player Engine & Server Trust Boundary

> **Version**: 2.0.0 (LE-007B Hardened)  
> **Status**: Server-Authoritative Interactive Runtime  
> **Repository**: `luoienglish`

---

## 1. Overview & Trust Boundaries

The **Interactive Learning Player Engine** enforces strict server-authoritative validation for every learning activity attempt, session completion, reward credit, and cognitive mastery calculation.

### What the Client Sends (Untrusted Input)
- Raw interaction choices: `selectedOptionId`, `userBuiltWords`, `typedText`, `matchedPairIds`, `spokenTranscript`, `audioRecordingDurationMs`.
- Activity ID to solve.

### What the Server Authoritatively Computes (Trusted Output)
- `correct` (derived deterministically via `ActivityEvaluatorFactory`).
- `score` (computed based on correctness and hints used).
- `skill` (derived from authoritative curriculum schema).
- `knowledgeIds` (mapped strictly from `activity.knowledgeItemIds`).
- `starsEarned`, `xpEarned`, `petFoodEarned` (computed exclusively from server-persisted evidences).
- `KnowledgeMastery` multidimensional updates (applies `MasteryUpdatePolicy` solely on verified server evidences).

---

## 2. Server Session Lifecycle & REST Endpoints

```
┌────────────────────────┐         ┌────────────────────────┐         ┌────────────────────────┐
│ POST /session/start    │ ──────> │ POST .../attempt       │ ──────> │ POST .../complete      │
│                        │         │                        │         │                        │
│ • Verifies auth/child  │         │ • Evaluates raw answer │         │ • Verifies all done    │
│ • Inits server session │         │ • Generates evidence   │         │ • Credits rewards      │
│ • Returns sessionId    │         │ • Advances state       │         │ • Updates mastery      │
└────────────────────────┘         └────────────────────────┘         └────────────────────────┘
```

1. **`POST /api/learning/session/start`**:
   - Authenticates parent account & checks child ownership.
   - Verifies lesson exists.
   - Generates or resumes authoritative `LearningSession` record.

2. **`POST /api/learning/session/[sessionId]/attempt`**:
   - Accepts raw response data.
   - Dispatches to matching `IActivityEvaluator`.
   - Appends verified `LearningEvidence` to server session.
   - Enforces optimistic concurrency (`version: number`).

3. **`POST /api/learning/session/[sessionId]/complete`**:
   - Validates that all required activities in `lesson.activities` have trusted evidences.
   - Calculates authoritative stars/XP/pet food.
   - Commits rewards idempotently to `RewardRepository`.
   - Updates `KnowledgeMastery` in `MemoryRepository`.
   - Marks session completed.

4. **`GET /api/learning/session/[sessionId]`**:
   - Hydrates player state securely upon browser reload.

---

## 3. Activity Evaluators Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   ActivityEvaluatorFactory                  │
├──────────────────────────────┬──────────────────────────────┤
│ Activity Type                │ Domain Evaluator             │
├──────────────────────────────┼──────────────────────────────┤
│ `choose_correct`, `multiple` │ MultipleChoiceEvaluator      │
│ `sentence_builder`           │ SentenceBuilderEvaluator     │
│ `writing_input`, `fill`      │ WritingEvaluator             │
│ `match_pairs`, `word_match`  │ MatchPairsEvaluator          │
│ `listen_and_repeat`, `speak` │ SpeakingEvaluator            │
│ `vocabulary_card`            │ VocabularyCardEvaluator      │
└──────────────────────────────┴──────────────────────────────┘
```
