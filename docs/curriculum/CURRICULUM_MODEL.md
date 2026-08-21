# LƯỜI ENGLISH — Curriculum & Knowledge Model

## 1. Curriculum Hierarchy

The curriculum is structured in a strict, data-driven hierarchy:

```
Curriculum (e.g., Vietnam Standard School English)
  └── Grade (Grade 1 through Grade 12; Initial: Grade 1–5)
        └── Semester (Semester 1, Semester 2)
              └── Unit (e.g., Unit 1: Hello & Friends)
                    └── Lesson (e.g., Lesson 1: What's your name?)
                          └── KnowledgeItem (e.g., "hello", "What's your name?")
                                └── Activity (e.g., Listen & Repeat, Word Match, Mini Dialogue)
```

---

## 2. Separation of School Grade vs. English Level

In LƯỜI ENGLISH, a student's **School Grade** is decoupled from their **CEFR/English Competency Level**:
- **School Grade**: Determines school-aligned topics, units, and vocabulary required for classroom success in Vietnam (e.g., Grade 3, Grade 4).
- **English Level**: Determines language complexity, grammar depth, and AI tutor speech rate (e.g., Pre-A1, A1, A2, B1).

Example student state:
```typescript
{
  schoolGrade: 3,
  englishLevel: "A1",
  targetVocabularyCount: 250
}
```

---

## 3. KnowledgeItem Specification

Each `KnowledgeItem` represents an atomic unit of linguistic knowledge with a specific type:

| Type | Description | Example |
| :--- | :--- | :--- |
| `vocabulary` | Single word | `"friend"` |
| `chunk` | Natural phrase / collocation | `"Nice to meet you"` |
| `grammar` | Sentence pattern or rule | `Subject + is/am/are + Name` |
| `pronunciation` | Phonics, stress, or intonation rule | `/f/ vs /v/`, rising question intonation |
| `communication_function` | Pragmatic speech act | Introducing oneself, Greeting |
| `listening_pattern` | Comprehension acoustic cue | Reduced forms: `"What's"` vs `"What is"` |
| `reading_pattern` | Sight word / orthographic cluster | `igh` sound in `"night"` |
| `writing_pattern` | Punctuation / sentence construction | Capital letter at start, question mark |

### Acquisition Stages
Every knowledge item is tracked across 6 cognitive mastery stages:
1. **Recognize**: Identify the item when heard or seen.
2. **Recall**: Retrieve the item from memory without prompts.
3. **Understand**: Comprehend the meaning in various contexts.
4. **Use**: Apply the item in a structured sentence.
5. **Produce**: Spontaneously speak or write the item in communication.
6. **Transfer**: Apply the item accurately in novel, unpracticed situations.

---

## 4. Communication-First Progression

Every lesson adheres to the communication-first ladder:
```
WORD (e.g., "apple")
  └── CHUNK (e.g., "an apple")
        └── SENTENCE (e.g., "I like apples.")
              └── QUESTION (e.g., "Would you like an apple?")
                    └── ANSWER (e.g., "Yes, please. / No, thank you.")
                          └── CONVERSATION (Mini 2-way dialogue)
                                └── SITUATION (Simulated fruit market or snack time)
```

---

## 5. Independent Content Authoring
- Content is authored as structured data in JSON / TypeScript definitions.
- The program references Vietnam national curriculum topics (e.g., Global Success topics) for educational relevance, but all stories, dialogues, activities, and questions are **100% original IP** and independently authored.
