# LƯỜI ENGLISH — Architecture Context for AI Agents

## Core Architectural Invariants:
1. **Next.js Modular Monolith**: Everything lives within a well-structured Next.js project. No premature microservice fragmentation.
2. **Layering & Inversion of Control**:
   - `src/components/` -> Pure UI & Presentational components.
   - `src/features/` -> Feature hooks, client-side view state machines.
   - `src/engines/` -> Pure business & cognitive algorithms (Memory, Reward, Adaptive).
   - `src/repositories/` -> Abstract database contracts with in-memory & Firestore implementations.
   - `src/services/` -> AI Gateway, Speech, Auth, Firebase adapters.
3. **No Direct Firebase in UI**: Never do `import { db } from '@/services/firebase'` inside a reusable UI component.
4. **Theme Boundary**: Switching between `cozy` and `explorer` is purely visual and must never touch business logic.
