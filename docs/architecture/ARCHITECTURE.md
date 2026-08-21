# LƯỜI ENGLISH — Architecture Blueprint

## 1. Architectural Style: Modular Monolith

LƯỜI ENGLISH is architected as a **Modular Monolith** using Next.js (App Router), TypeScript Strict, Tailwind CSS, and a pluggable Repository / Service layer.

### System Layering

```
[Presentation Layer: App Router + UI Components]
               │ (UI never imports Firebase SDK directly)
               ▼
[Feature & Orchestration Layer]
               │ (Handles application state, user sessions, activity flow)
               ▼
[Domain Engines]
  ├─ Curriculum Engine (Curriculum/Grade/Semester/Unit/Lesson/KnowledgeItem/Activity)
  ├─ Memory Engine (Spaced Repetition & Cognitive Mastery Scoring)
  ├─ Reward Engine (Idempotent Server-Trusted Reward Ledger)
  └─ Adaptive Engine (Weakness Detection & Difficulty Calibration)
               │
               ▼
[Repository Abstractions (Interfaces)]
  ├─ IUserRepository, IChildRepository
  ├─ ICurriculumRepository, IProgressRepository
  ├─ IMemoryRepository, IRewardRepository, IPetRepository
               │
               ▼
[Adapters & External Services]
  ├─ InMemory Repositories (For Unit/Integration Tests & Offline Dev)
  ├─ Firebase Firestore & Auth Repositories (Production)
  ├─ Server-Side AI Gateway (Multi-provider LLM abstraction)
  └─ Web Speech / Audio Storage Adapters
```

---

## 2. Key Architecture Tenets

### A. Strict UI & Backend Boundary
- Reusable UI components (`src/components/ui/`, `src/components/learning/`, etc.) MUST NOT import Firebase SDK directly.
- All state changes that mutate progress, currency/rewards, or child profiles invoke typed repository methods or Next.js server actions/API endpoints.

### B. Dual-Theme Isolation
- LƯỜI ENGLISH supports two first-class themes: **Cozy Lười** and **Explorer Lười**.
- The theme system only influences design tokens (colors, gradients, typography scales, card borders), mascot skin, illustrations, and ambient audio.
- Theme switching **MUST NEVER** alter business logic, curriculum flow, memory formulas, or database records.

### C. Server-Trusted Reward Ledger
- Client applications emit *learning events* (`lesson_completed`, `review_recalled`, `speaking_accuracy_high`).
- The backend `RewardEngine` computes XP, Stars, and Pet Food based on pedagogical value (e.g. recalling difficult spaced-repetition items gives higher rewards than simply clicking through new items).
- All transactions are recorded in an append-only `rewardLedger` with idempotency keys.

### D. Provider-Neutral Server-Side AI Gateway
- All AI calls (Tutor hints, pronunciation analysis, free conversation) are routed through a server-side AI Gateway (`src/services/ai/`).
- No API keys or LLM provider SDKs are ever exposed to the client.
- The AI Gateway enforces child-safe prompt templates, structured JSON outputs, and scaffolded hints (`Hint 1 -> Hint 2 -> Example -> Answer`).

---

## 3. Directory Topology

```
src/
├── app/               # Next.js App Router (Student, Parent, Admin, APIs)
├── components/        # Isolated UI, theme, mascot, learning, and pet components
├── content/           # Static curriculum definitions & seed fixtures
├── engines/           # Pure domain logic (Memory, Reward, Adaptive)
├── features/          # Feature-level state hooks and orchestrators
├── lib/               # Utility functions, theme tokens, asset & audio registries
├── repositories/      # Data access interfaces and implementations (InMemory & Firestore)
├── services/          # External services (AI Gateway, Firebase client/admin, Speech)
└── types/             # Strict TypeScript domain schemas and interfaces
```
