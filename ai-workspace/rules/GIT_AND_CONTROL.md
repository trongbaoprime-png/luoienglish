# LƯỜI ENGLISH — Git & Control Rules

1. **Branch Strategy**:
   - Main development branch for Phase 0: `foundation/v1`.
   - Feature branches follow: `feat/LE-xxx-name`, `fix/LE-xxx-name`.
2. **Atomic Commits**:
   - Every commit must represent a single logical change.
   - Commit message prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`.
3. **Pre-Commit Verification**:
   - Always run `npm run typecheck` and `npm run lint` before committing.
   - Never commit broken builds or failing tests.
4. **Preserve Clean History**:
   - Do not commit local environment secrets (`.env`, `.env.local`).
   - Do not commit temporary scratch files.
