# ADR-002: Dual-Theme Architecture (Cozy & Explorer)

## Status: Accepted

## Context
Children have different visual and emotional preferences (some prefer calm, snuggly reading environments; others love dynamic, gamified quests). We must support both without maintaining two separate apps.

## Decision
Implement a single core UI powered by dynamic design tokens (`ThemeProvider`).
- Theme A: `cozy` (Cozy Lười)
- Theme B: `explorer` (Explorer Lười)
Theme strictly affects tokens, mascot skin, card styling, and ambient audio—never business logic or database schemas.

## Consequences
- 100% logic reuse across themes.
- Children can switch themes anytime without data migration.
