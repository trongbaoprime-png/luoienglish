# LƯỜI ENGLISH — Foundation Bootstrap Plan (PLAN.md)

> **Repository**: `luoienglish`  
> **Product Name**: LƯỜI ENGLISH  
> **Brand Slogan**: *"Lười học mà vẫn giỏi."*  
> **Primary Mascot**: CHÚ LƯỜI (Friendly, curious Sloth) — *Strictly NO dinosaurs/Dino branding.*  
> **Target Audience**: Vietnamese children (Initial: Grade 1–5, Architecture-ready for Grade 1–12).

---

## 1. Executive Summary & Product North Star

LƯỜI ENGLISH is a next-generation, high-retention English learning platform crafted specifically for Vietnamese children. Rather than relying on rote memorization or passive screen time, it merges:
- **Vietnamese School Curriculum Alignment** (Grade 1–12, starting with Grade 1–5)
- **Communication-First Methodology** (Word → Chunk → Sentence → Question → Answer → Conversation → Situation)
- **Active Recall & Spaced Repetition** (Cognitive Memory Engine tracking individual item mastery)
- **Comprehensible Input & Story/Media Immersion**
- **Dual-Theme Adaptive UI** (`Cozy Lười` vs `Explorer Lười`)
- **Emotional Companion Gamification** (Chất Lười Pet Companion + Server-Trusted Reward Ledger)
- **Safe, Scaffolded AI Tutoring** (Server-side AI Gateway with multi-tier hints)

---

## 2. Architectural Pillars

```
+-----------------------------------------------------------------------------------+
|                                 LƯỜI ENGLISH UI                                   |
|   (Next.js App Router, Tailwind CSS, Lucide, Framer Motion, Radix UI)             |
|   Dual Themes: Cozy Lười (Warm/Calm) & Explorer Lười (Energetic/Quest)            |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             FEATURE / USE CASE LAYER                              |
|   Curriculum | Learning Player | Memory | Speaking | Reward | Pet | AI Gateway    |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              DOMAIN ENGINES & LOGIC                               |
|   Curriculum Engine | Memory Engine (SRS) | Reward Engine | Adaptive Engine       |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                              REPOSITORY ABSTRACTION                               |
|   ICurriculumRepo | IProgressRepo | IMemoryRepo | IRewardRepo | IPetRepo          |
|      (In-Memory Mock Adapters for Tests / Firestore Production Adapters)          |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             INFRASTRUCTURE / SERVICES                             |
|   Firebase Auth & Firestore | Server-Side AI Gateway | Web Speech / Media Storage |
+-----------------------------------------------------------------------------------+
```

### Core Architecture Rules:
1. **Modular Monolith**: Clean layer separation without premature distributed complexity.
2. **UI Independence**: UI components NEVER directly import or depend on Firebase SDK or external AI SDKs. All data access flows through typed Repositories and Services.
3. **Theme Independence**: Themes (`cozy` vs `explorer`) strictly change visual presentation, mascot skin, card style, design tokens, and ambient audio—**NEVER** curriculum, progress, memory calculations, reward logic, or database schemas.
4. **Data-Driven Curriculum**: Lessons and activities are pure, validated JSON/TypeScript data models, never hard-coded into JSX.
5. **Server-Trusted Rewards**: Client can only request reward events; rewards and ledger balances are calculated and validated by the backend `RewardEngine`.
6. **Child Safety by Design**: Zero public child profiles, zero stranger messaging, zero predatory pay-to-win mechanics, COPPA/GDPR-K aligned privacy boundaries, and strict AI safety filters.

---

## 3. Two-Theme System Specification

| Attribute | **Cozy Lười** | **Explorer Lười** |
| :--- | :--- | :--- |
| **Personality** | Soft, warm, calm, story-oriented, encouraging | Adventurous, curious, energetic, quest-oriented |
| **Color Palette** | Cream, Warm Amber, Sage Green, Terracotta, Soft Peach | Ocean Blue, Vibrant Emerald, Sunrise Gold, Electric Purple |
| **Environments** | Treehouse, Library, Forest Nook, Cozy Classroom | Adventure Map, Story Forest, Audio Lake, Science Island |
| **Mascot Styling** | Fluffy sloth with scarf/reading glasses/book | Explorer sloth with backpack, goggles, compass |
| **Motion & Audio**| Gentle fades, slow bounces, relaxing acoustic ambience | Dynamic springs, punchy pops, uplifting upbeat audio |

---

## 4. Phased Roadmap (12 Phases)

- **PHASE 0: Foundation Bootstrap** *(Current Milestone)*: Project structure, docs, AI workspace, strict TS types, theme system, semantic registries, sample curriculum, memory & reward engines, repository boundaries, build validation.
- **PHASE 1: Parent & Child Identity + Theme Selection**: Parent Auth, Multi-child Profiles, Theme Switcher (`cozy`/`explorer`), Child Safety gates.
- **PHASE 2: Curriculum Foundation**: Curriculum hierarchical data engine, Knowledge Graph models, Unit/Lesson query services.
- **PHASE 3: Learning Player**: Interactive activity engine (Listen, Repeat, Match, Choose, Speak, Mini-conversation).
- **PHASE 4: Reward Ledger & Pet Companion**: Server-trusted reward ledger, Pet hatching/feeding/bonding progression.
- **PHASE 5: Adventure Map & School Portal**: Grade 1–5 visual quest map & School textbook alignment view.
- **PHASE 6: Cognitive Memory Engine**: Spaced repetition active recall queue, forgetting-risk prediction, weakness detection.
- **PHASE 7: Speaking & Safe AI Tutor**: Speech evaluation pipeline, Chú Lười AI Tutor (Hint 1 → Hint 2 → Example → Answer).
- **PHASE 8: Story & Media World**: Interactive read-along stories, kids news, songs, clickable transcripts, shadowing.
- **PHASE 9: Educational Game Land**: Grammar/vocabulary mini-games with pedagogical reinforcement.
- **PHASE 10: Parent Insights Dashboard**: True learning metrics (speaking time, active recall, listening exposure, mastered knowledge).
- **PHASE 11: Admin Content Factory**: Curriculum builder, lesson editor, question bank, AI-assisted educator review workflow.
- **PHASE 12: Security, Performance & Scale Hardening**: Rate limits, audit logs, caching, PWA offline support.

---

## 5. Task Contracts (LE-001 through LE-011)

- **LE-001**: Foundation Bootstrap *(R2 Data/Architecture)*
- **LE-002**: Two-Theme System & Semantic Token Engine *(R1 Feature)*
- **LE-003**: Firebase & In-Memory Repository Abstraction Layer *(R2 Data/Architecture)*
- **LE-004**: Parent Authentication & COPPA-Safe Auth Gate *(R3 Security/Auth)*
- **LE-005**: Multi-Child Profile & Age-Appropriate Preferences *(R3 Security/Auth)*
- **LE-006**: Grade 3 "Hello & Friends" Curriculum Seed & Content Schema *(R1 Feature)*
- **LE-007**: Multi-Activity Interactive Learning Player *(R1 Feature)*
- **LE-008**: Server-Trusted Reward Ledger & Anti-Cheat Engine *(R2 Data/Architecture)*
- **LE-009**: Chú Lười Pet Companion & Progression System *(R1 Feature)*
- **LE-010**: Interactive Visual Adventure Map & World Hub *(R1 Feature)*
- **LE-011**: First Vertical Slice End-to-End Integration *(R2 Data/Architecture)*

---

## 6. Bootstrap Verification Criteria

1. Strict TypeScript compilation passes with zero type errors.
2. Lint check passes cleanly.
3. Production build (`npm run build`) completes successfully.
4. Memory Scheduler test suite passes.
5. Reward Policy test suite passes.
6. Semantic asset & audio registry resolutions are verified.
7. Mascot Character Bible and Brand identity strictly enforce Chú Lười (Sloth) with zero dinosaur references.
