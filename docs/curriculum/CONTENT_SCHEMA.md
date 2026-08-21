# LƯỜI ENGLISH — Content Schema & Data-Driven Architecture

> **Version**: 1.0.0  
> **Status**: Core Domain Blueprint  
> **Repository**: `luoienglish`

---

## 1. Complete Content Hierarchy

```
Curriculum (e.g. Vietnam National MOET 2018 & Global Success)
  └── Grade (Grade 1 to 12)
        └── Semester (1 | 2)
              └── Unit (e.g. Unit 1: Hello & Greetings)
                    └── Lesson (e.g. Lesson 1: How are you?)
                          ├── LearningObjectives (Can-Do & Real-World Statements)
                          ├── KnowledgeItems (Reusable Graph Nodes)
                          └── Activities (Interactive Exercises)
```

---

## 2. Learning Objective Model: The 7 Core Questions

Every `LearningObjective` must provide explicit answers to:

1. **Understand**: What should the child conceptually understand?
2. **Recognize**: What should the child recognize in speech and text?
3. **Say**: What specific phrase or sentence should the child say?
4. **Hear**: What speech patterns should the child hear and decode?
5. **Read**: What text formats should the child read?
6. **Write**: What words/sentences should the child write?
7. **Real-World Context**: In what everyday situation would a child use this?

---

## 3. Future AI Tutor Compatibility Structure

All curriculum data models prepare the context payload for future server-side AI Tutor interactions (`AITutorContext`):

```typescript
export interface AITutorContext {
  currentObjective: LearningObjective;
  knownVocabulary: string[];
  weakKnowledgeIds: string[];
  allowedDifficulty: CefrLevel;
  conversationScenario: string;
  expectedResponse: string;
  scaffoldLevel: 1 | 2 | 3; // 1 = minimal hint, 2 = partial frame, 3 = full scaffold
}
```
