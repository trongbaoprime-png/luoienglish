---
name: backend
description: Guidelines for building domain engines, API routes, repositories, and business logic in LƯỜI ENGLISH.
---
# Backend Skill for LƯỜI ENGLISH

## Rules:
- Implement pure business logic inside `src/engines/`.
- Repositories must implement interfaces from `src/repositories/interfaces/`.
- Keep API routes in `src/app/api/` strictly typed with request validation and structured JSON error handling.
- Protect all state changes with idempotency keys.
