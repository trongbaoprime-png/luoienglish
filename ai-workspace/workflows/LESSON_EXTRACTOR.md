# LƯỜI OS — Lesson Extractor Workflow

> **Core Axiom**: "A fixed bug without a reusable institutional lesson is an incomplete task."  
> **Trigger**: Executed whenever a bug, security vulnerability, or architectural review finding is identified and fixed.

---

## The 6-Stage Extraction Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ 1. INCIDENT: What broke or what was blocked in review?       │
├─────────────────────────────────────────────────────────────┤
│ 2. ROOT CAUSE: Why did the architecture allow this failure? │
├─────────────────────────────────────────────────────────────┤
│ 3. GENERALIZE: Strip project-specific details into a rule   │
├─────────────────────────────────────────────────────────────┤
│ 4. MEMORY: Append new ID (e.g. SEC-AUTH-011) to memory/     │
├─────────────────────────────────────────────────────────────┤
│ 5. CHECKLIST: Add a concrete question to checklists/        │
├─────────────────────────────────────────────────────────────┤
│ 6. REGRESSION TEST: Add automated attack test to test suite │
└─────────────────────────────────────────────────────────────┘
```

### Protocol Requirements:
1. Assign a unique ID following conventions (`SEC-AUTH-xxx`, `SEC-DATA-xxx`, `ARCH-xxx`, `AGENT-xxx`).
2. Document all 8 required schema fields in `ai-workspace/memory/*.md`.
3. Add a corresponding verification gate in the relevant `ai-workspace/checklists/*.md`.
4. Ensure an automated regression test exists in the codebase covering the exact attack scenario.
