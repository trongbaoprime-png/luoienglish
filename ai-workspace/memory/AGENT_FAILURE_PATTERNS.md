# LƯỜI ENGLISH — Agent Failure Patterns & Operating Guardrails

> **Knowledge Classification**: AI Agent Operating Rules & Anti-Failure Guidelines  
> **Target Audience**: Autonomous Agents, Code Assistants, Automation Workflows

---

## 1. Top Agent Anti-Patterns

### Failure 1: "Claiming Done Without Full Verification"
- **Behavior**: Agent writes code, edits a file, and immediately says "Done!" without running `tsc`, `lint`, `test`, and `build`.
- **Consequence**: Broken imports, lint errors, or type regressions committed to git.
- **Rule**: NEVER declare a task complete until running:
  1. `npm run typecheck`
  2. `npm run lint`
  3. `npm run test`
  4. `npm run build`

### Failure 2: "Conflating React State with Server Security"
- **Behavior**: Agent implements a security boundary by checking `isUnlocked` in React context and using `router.push('/login')`.
- **Consequence**: Any user can disable JavaScript, use cURL, or fetch `/parent` SSR HTML and view sensitive data.
- **Rule**: All security gates MUST execute cryptographically on Server Components or API Routes (`/api/**`).

### Failure 3: "Violating Locked Brand / Mascot Identity"
- **Behavior**: Agent introduces dinosaur assets or mentions "Dino" as our mascot.
- **Consequence**: Severe breach of brand constitution (`PROJECT_CONSTITUTION.md`).
- **Rule**: The mascot is exclusively **CHÚ LƯỜI** (a friendly, clever SLOTH). "Lười học mà vẫn giỏi." Dinosaur is strictly prohibited.

### Failure 4: "Skipping Ahead to Future Tasks (e.g. LE-005)"
- **Behavior**: When reviewing LE-004, agent starts writing child profile creation or curriculum seeding for LE-005 without waiting for explicit user sign-off.
- **Consequence**: Work on unapproved foundations creates cascading refactors.
- **Rule**: Complete current task, verify, commit, report exact evidence, and **STOP**.

---

## 2. Autonomous Remediation Protocol

If a verification gate fails during autonomous execution:
1. **Isolate**: Identify the exact failing file and line number from logs.
2. **Diagnose**: Check if it is a type mismatch, lint rule, or logic regression.
3. **Fix Contiguously**: Use surgical replacement tools.
4. **Re-Verify Full Matrix**: Do not just re-run the single test; run the entire validation suite.
5. **Stage & Commit**: Make atomic, clean git commits.
