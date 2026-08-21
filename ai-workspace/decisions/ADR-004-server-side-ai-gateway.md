# ADR-004: Server-Side AI Gateway & Scaffolded Tutoring

## Status: Accepted

## Context
Children need safe, pedagogical help when learning. Direct client-side AI API calls expose credentials, lack content safety filters, and risk giving raw answers instead of scaffolding.

## Decision
Route all AI interactions through a provider-neutral Server-Side AI Gateway (`src/services/ai/AIGateway.ts`). The gateway enforces child safety guardrails, structured JSON outputs, and scaffolded hints (`Hint 1 -> Hint 2 -> Example -> Answer`).

## Consequences
- Zero client credential exposure.
- Pluggable backend (Gemini, Claude, OpenAI, local models).
- Consistent, kid-safe responses.
