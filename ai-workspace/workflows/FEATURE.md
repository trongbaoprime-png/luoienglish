# Feature Development Workflow

1. **Task Contract Check**: Select or create task contract in `ai-workspace/tasks/backlog/` (e.g. `LE-xxx`).
2. **Impact Analysis**: Identify affected types, engines, repositories, and UI components.
3. **Implementation**:
   - Write/update domain types in `src/types/`.
   - Update engine or repository interfaces.
   - Implement business logic & tests.
   - Build UI components adhering to `ThemeProvider`.
4. **Validation**:
   - Run `npm run typecheck`
   - Run `npm run lint`
   - Run unit tests
   - Run `npm run build`
5. **Atomic Commit**: Commit with message `feat(scope): concise description`.
