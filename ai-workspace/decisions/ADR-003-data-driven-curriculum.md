# ADR-003: Data-Driven Curriculum & Content Engine

## Status: Accepted

## Context
Hardcoding lesson text into UI components creates brittle applications and blocks content scaling.

## Decision
All curriculum entities (`Curriculum`, `Grade`, `Semester`, `Unit`, `Lesson`, `KnowledgeItem`, `Activity`) are modeled as pure data structures conforming to strict TypeScript schemas.

## Consequences
- Content can be authored, validated, imported, and updated independently of UI code.
- Enables future Admin Content Factory and CMS integrations seamlessly.
