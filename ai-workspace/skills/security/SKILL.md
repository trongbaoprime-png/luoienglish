---
name: security
description: Guidelines for child data privacy, COPPA compliance, rate limiting, and server-side validation.
---
# Security Skill for LƯỜI ENGLISH

## Rules:
- Enforce parent gate / authentication before altering settings or accessing payment/subscription screens.
- Zero public child profiles or unmoderated communications.
- Validate all incoming payloads with Zod or strict type guards.
- Log sensitive operations to audit log.
