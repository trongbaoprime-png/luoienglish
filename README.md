# 🦥 LƯỜI ENGLISH

> **"Lười học mà vẫn giỏi."**  
> *A high-retention, communication-first English learning platform designed specifically for Vietnamese children.*

---

## 🌟 Product Overview

**LƯỜI ENGLISH** transforms English learning into an effortless, delightful adventure for Vietnamese students (Grade 1–12, starting with Grade 1–5). Guided by our mascot **Chú Lười** (the friendly sloth), students acquire English through:
- **Communication-First Ladder**: Word → Chunk → Sentence → Question → Answer → Conversation → Situation.
- **Active Recall & Spaced Repetition**: Real-time mastery scoring and intelligent review scheduling.
- **Dual-Theme Experience**: Switch freely between **Cozy Lười** (soft, warm treehouse) and **Explorer Lười** (energetic, quest-filled adventure).
- **Safe AI Tutoring**: Server-side scaffolded hints (`Hint 1 -> Hint 2 -> Example -> Answer`).
- **Server-Trusted Rewards & Pet Companion**: Hatch and nurture Chú Lười pet companion through authentic learning accomplishments.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 15 (App Router), React 19, TypeScript (Strict Mode)
- **Styling**: Tailwind CSS, CSS Variables Design Token System
- **Animation & Icons**: Framer Motion, Lucide React
- **Architecture**: Modular Monolith with Repository Pattern (Pluggable In-Memory and Firebase Firestore adapters)
- **AI Gateway**: Provider-neutral server-side AI Gateway (Gemini / Claude / OpenAI / Local)

---

## 📁 Repository Structure

```
├── docs/                # Architecture, Curriculum, Design Bible, Roadmap, Child Safety
├── ai-workspace/        # AI Constitution, State, Context, Rules, Skills, Workflows, Tasks, ADRs
├── src/
│   ├── app/             # App Router (Student Portal, Parent Dashboard, Admin, API Routes)
│   ├── components/      # UI, Theme, Mascot, Learning Player, Pet components
│   ├── content/         # Data-driven curriculum seeds (Grade 3 Hello & Friends)
│   ├── engines/         # Pure domain algorithms (Memory Spaced Repetition, Reward Policy)
│   ├── features/        # Feature hooks and state machines
│   ├── lib/             # Semantic Asset Registry, Audio Registry, Theme Tokens
│   ├── repositories/    # Data access interfaces & implementations (InMemory & Firestore)
│   ├── services/        # Firebase adapters, AI Gateway, Speech evaluation
│   └── types/           # Strict TypeScript schemas
└── public/              # Static assets and audio directories
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run Quality Checks
```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

---

## 🔒 Child Safety & Privacy
LƯỜI ENGLISH is COPPA/GDPR-K aligned. All child profiles exist under parent accounts with zero stranger messaging, zero public profiles, transient audio evaluation, and strict AI safety filters.
