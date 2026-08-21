# ADR-001: Next.js Modular Monolith

## Status: Accepted

## Context
We need a unified, performant, and maintainable platform for LƯỜI ENGLISH serving students, parents, and educators. Premature microservices introduce high operational latency and deployment friction for a startup product.

## Decision
Build LƯỜI ENGLISH as a Modular Monolith in Next.js (App Router) with strict domain layer boundaries, clean repository interfaces, and pure domain engines.

## Consequences
- Single codebase with instant full-stack type safety.
- Simple local dev and automated testing.
- Easy to extract specific engines (e.g. Speech/AI) to microservices later if scaling demands.
