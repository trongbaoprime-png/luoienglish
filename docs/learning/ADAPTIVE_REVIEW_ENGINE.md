# LƯỜI ENGLISH — Adaptive Review Engine & Memory Loop

> **Version**: 1.0.0 (LE-008)  
> **Status**: Production Domain Specification  
> **Scope**: Multidimensional Weakness Detection, Contextual Recall & Interleaved Review  

---

## 1. Executive Summary & Core Principle

Learning a second language requires moving beyond isolated rote repetition. An effective adaptive memory loop must answer:
1. **What should this child review now?** (Prioritized by cognitive decay, weakness, and curriculum prerequisites).
2. **Why should it be reviewed?** (Explainable reasons: `WEAK_SKILL`, `OVERDUE`, `FORGETTING_RISK`, `PREREQUISITE_GAP`).
3. **Which skill is weak?** (Isolated across 7 dimensions: Recognition, Listening, Speaking, Reading, Writing, Pronunciation, Application).
4. **Which review format should be used?** (Contextual rotation across flashcards, listening challenges, speech prompts, interactive conversations, and stories).
5. **How difficult should the next review be?** (Dynamic calibration: `EASIER`, `CURRENT`, `HARDER`).
6. **When should this knowledge appear again?** (Non-linear spaced repetition based on performance and latency).
7. **When is the child ready to progress?** (Gated on core prerequisites without punitive blocks).

```
Trusted Learning Evidence
        ↓
Multidimensional Mastery (7 Dimensions)
        ↓
Memory State & Decay Estimation
        ↓
Weakness Detection
        ↓
Adaptive Priority Policy (V1)
        ↓
Context Selection Policy (Modality Rotation)
        ↓
Adaptive Activity (Built dynamically via ReviewActivityBuilder)
        ↓
Trusted Learning Evidence
        ↓
Mastery Update (Target Skill Focused)
        ↓
Next Review Interval
        ↺
```

---

## 2. Adaptive Priority Policy V1

The prioritization algorithm computes an explainable score between $0$ and $100$:

$$\text{Priority} = \text{Base} + W_{\text{overdue}} + W_{\text{weakness}} + W_{\text{forgetting}} + W_{\text{prereq}} + W_{\text{recent\_failure}} - P_{\text{overexposure}}$$

- **Base Score**: 50
- **$W_{\text{overdue}}$**: $+5$ per overdue day (up to $+30$).
- **$W_{\text{weakness}}$**: Up to $+25$ when the weakest skill dimension is below 50/100.
- **$W_{\text{forgetting}}$**: Up to $+25$ based on the normalized decay risk ($0.0 \to 1.0$).
- **$W_{\text{prereq}}$**: $+20$ if blocking subsequent lesson progression.
- **$W_{\text{recent\_failure}}$**: $+15$ if the consecutive correct streak was reset to 0.
- **$P_{\text{overexposure}}$**: $-20$ to $-40$ penalty for highly mastered items ($>85$) seen within 24 hours.

---

## 3. Multidimensional Mastery Isolation

A high global recognition score must never hide a lagging communicative skill:
- **Scenario**: Word *Hello* with Recognition = 95, Listening = 90, but Speaking = 35.
- **Policy Decision**: The engine targets **Speaking** (`targetSkill = "speaking"`), triggering a `speaking_challenge` or `mini_conversation` rather than a standard multiple-choice flashcard.

---

## 4. Context Rotation Policy

To foster authentic linguistic reflex, the same item is tested through different cognitive modalities across time:
- Day 1: Flashcard / Discovery
- Day 3: Listen & Choose
- Day 7: Speak Aloud to Chú Lười
- Day 14: Story Character Interaction
- Day 30: Mini Conversation in real-world scenario
