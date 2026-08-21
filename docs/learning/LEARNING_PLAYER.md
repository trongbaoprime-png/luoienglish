# LƯỜI ENGLISH — Interactive Learning Player Engine

> **Version**: 1.0.0  
> **Status**: Core Interactive Runtime  
> **Repository**: `luoienglish`

---

## 1. Overview

The **Interactive Learning Player Engine** (`LessonPlayer`) is the data-driven runtime that presents pedagogical activities to children, collects structured learning evidence, and interacts with the Cognitive Memory Engine and Reward Ledger.

Key Architectural Guarantees:
- **Zero Hard-coded Content**: The player components do not know what grade, unit, or lesson is being played. Everything is rendered dynamically from `ActivityRegistry`.
- **Authoritative Server Verification**: Client cannot claim stars, XP, or lesson completion without completing all required activities in order.
- **Multidimensional Evidence**: Every attempt generates structured `LearningEvidence` feeding directly into `MasteryUpdatePolicy`.

---

## 2. Activity Renderers Registry

```
┌─────────────────────────────────────────────────────────────┐
│                       ActivityRegistry                      │
├──────────────────────────────┬──────────────────────────────┤
│ Activity Type String         │ Renderer Component           │
├──────────────────────────────┼──────────────────────────────┤
│ `vocabulary_card`            │ VocabularyCardRenderer       │
│ `listen_and_repeat` / speak  │ SpeakingPromptRenderer       │
│ `choose_correct` / multi     │ MultipleChoiceRenderer       │
│ `sentence_builder`           │ SentenceBuilderRenderer      │
│ `mini_conversation`          │ MiniConversationRenderer     │
│ `word_match` / match_pairs   │ MatchPairsRenderer           │
│ `fill_in_chunk` / writing    │ WritingInputRenderer         │
│ Unknown fallback             │ UnknownActivityFallback      │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 3. Session State Machine & Anti-Cheat

The `ProgressController` enforces strict invariants:
1. **No Skipping**: A lesson cannot transition to `completed` unless every activity ID in `lesson.activities` is present in `completedActivityIds`.
2. **Heart Penalty**: Wrong answers decrement hearts without shaming, triggering supportive scaffolding hints.
3. **Stale Write Defense**: Version counters (`version: number`) prevent stale browser tabs from overwriting newer progress.
4. **Cross-Child Isolation**: Sessions from different `childId`s cannot be merged.
