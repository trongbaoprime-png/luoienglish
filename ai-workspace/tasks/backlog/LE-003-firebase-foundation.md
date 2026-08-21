# Task Contract: LE-003 — Firebase & Repository Adapter Layer

- **Task ID**: `LE-003`
- **Goal**: Implement live Firebase client/admin wrappers and Firestore repository adapters implementing domain interfaces.
- **Risk Level**: `R2 Data/Architecture`
- **Acceptance Criteria**:
  1. Typed Firestore repositories for Users, Children, Curricula, Progress, Memory, Rewards, and Pets.
  2. Fallback to In-Memory adapters in test environments.
  3. Strict schema validation before persistence.
