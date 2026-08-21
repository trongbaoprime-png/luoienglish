# Bugfix Workflow

1. **Reproduction**: Create a failing unit test or deterministic reproduction script in `tests/`.
2. **Root Cause Analysis**: Isolate whether the bug is in domain engine, repository mapping, or UI rendering.
3. **Fix**: Apply minimal, surgical fix. Do NOT refactor unrelated code.
4. **Regression Check**: Verify existing tests pass and the reproduction test now passes.
5. **Commit**: Commit with message `fix(scope): concise description`.
