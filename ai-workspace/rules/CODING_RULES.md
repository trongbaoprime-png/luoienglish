# LƯỜI ENGLISH — Coding Rules

1. **Strict TypeScript**:
   - `noImplicitAny: true`, `strict: true`.
   - Never use `any`. Use `unknown` with type guards or explicit generics.
2. **Layer Isolation**:
   - UI components must not import backend/database SDKs directly.
   - All state mutations must flow through domain services or repositories.
3. **Pure Domain Engines**:
   - `engines/` directory must contain pure business logic with no UI or database dependencies.
   - All engines must be 100% unit-testable.
4. **Theme Hygiene**:
   - Use CSS custom properties or Tailwind semantic tokens (`theme-primary`, `theme-bg`, etc.).
   - Do not hardcode hex colors in component JSX unless part of a specific dynamic canvas/game rendering.
5. **Clean Code & Self-Documentation**:
   - Export explicit interfaces from `src/types/`.
   - All exported functions must have concise JSDoc headers.
