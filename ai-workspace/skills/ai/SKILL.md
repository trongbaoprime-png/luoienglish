---
name: ai
description: Guidelines for building AI Tutor prompts, speech evaluation, and server-side AI Gateway integrations.
---
# AI Skill for LƯỜI ENGLISH

## Rules:
- All AI calls must go through `src/services/ai/AIGateway.ts`.
- The AI Tutor must provide scaffolded help: `Hint 1` -> `Hint 2` -> `Example` -> `Answer`.
- Never prompt or allow the AI to ask the child for personal identification or school names.
- Enforce strict JSON output parsing with fallback defaults to prevent breaking UI rendering.
