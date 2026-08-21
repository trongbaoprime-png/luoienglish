# LƯỜI ENGLISH — Knowledge Graph Architecture

> **Version**: 1.0.0  
> **Status**: Core Domain Blueprint  
> **Repository**: `luoienglish`

---

## 1. Overview & Pedagogical Philosophy

In traditional educational applications, learning content is tightly coupled to individual lesson screens (e.g. Unit 1 contains words A, B, C; when Unit 1 finishes, those words are never seen again).

In **LƯỜI ENGLISH**, knowledge is modeled as a **Multi-dimensional Directed Knowledge Graph**:
- **KnowledgeItems** are independent, reusable nodes.
- **Edges** represent cognitive and pedagogical relationships (`prerequisite`, `reinforces`, `related`, `appliesIn`, `reviewOf`, `nextLevel`).
- A single `KnowledgeItem` (e.g. `What's your name?`) can be introduced in Grade 3 Unit 2, reinforced in a story in Unit 5, tested in a mini-game in Semester 2, and conversationalized with the AI Tutor.

---

## 2. Graph Relationship Types (Edge Semantics)

```
┌─────────────────────────────────────────────────────────────┐
│ [Node: vocab_hello]  ──── reinforces ────> [Node: vocab_hi] │
│         ▲                                                   │
│   prerequisite                                              │
│         │                                                   │
│ [Node: chunk_how_are_you] ── appliesIn ──> [Real-World App] │
└─────────────────────────────────────────────────────────────┘
```

| Edge Type | Direction | Pedagogical Meaning | Adaptive Engine Rule |
| :--- | :--- | :--- | :--- |
| `prerequisite` | $A \rightarrow B$ | Node A must be understood before Node B is introduced. | Do not schedule Node B until Node A mastery $\ge 60$. |
| `reinforces` | $A \leftrightarrow B$ | Practicing Node A deepens retention of Node B. | When Node A is reviewed, grant fractional boost to B. |
| `related` | $A \leftrightarrow B$ | Semantic cousins in the same lexical field. | Group together in theme challenges and vocabulary maps. |
| `appliesIn` | $A \rightarrow \text{Scenario}$ | Knowledge is applied in a situational dialogue/story. | Trigger roleplay scenario once recognition mastery $\ge 70$. |
| `reviewOf` | $A \rightarrow B$ | Composite review node consolidating multiple items. | Scheduled during spaced consolidation phases. |
| `nextLevel` | $A \rightarrow B$ | Skill progression (e.g. Word $\rightarrow$ Chunk $\rightarrow$ Discourse). | Unlock advanced speaking challenge upon milestone mastery. |

---

## 3. Cycle Prevention & Integrity Enforcement

The `CurriculumValidator` runs a Depth-First Search (DFS) cycle detection algorithm over all `prerequisite` edges.
- If $A \xrightarrow{\text{prereq}} B \xrightarrow{\text{prereq}} C \xrightarrow{\text{prereq}} A$ is detected, validation **FAILS IMMEDIATELY**.
- Broken target references (`targetId` not in graph) are rejected before deployment.
