# LƯỜI OS — Agent Failure Patterns Memory

> **Schema**: `ID` | `Context` | `Failure Pattern` | `Why It Failed` | `General Rule` | `Required Pattern` | `Attack/Test` | `Applies To`

---

### AGENT-001
- **ID**: `AGENT-001`
- **Context**: Agent completion reports, task delivery summaries, and pull request descriptions.
- **Failure Pattern**: Agent report makes stronger claims than the actual implementation evidence supports.
- **Why It Failed**: Agent states "The system is completely immune to session hijacking" when only a basic token check was implemented, giving false security confidence to reviewers.
- **General Rule**: Agent reports must only state facts backed by verifiable empirical test outputs (exact test counts, specific error codes, real build traces).
- **Required Pattern**:
  ```markdown
  ### Verification Evidence
  - Unit & Integration Tests: 43/43 passing (`tsx --test`)
  - Attack Test Matrix: 10/10 vectors verified
  - Build Status: Next.js 15 clean compile (21/21 routes)
  - Known Limitations: Backlog endpoints X and Y pending Milestone LE-007
  ```
- **Attack/Test**: Red Team Review: compare report claims against actual test logs and code paths.
- **Applies To**: All agent response summaries, PR descriptions, and task status reports.

---

### AGENT-002
- **ID**: `AGENT-002`
- **Context**: Quality descriptions, documentation, and commit messages.
- **Failure Pattern**: Using absolute, unprovable, or exaggerated wording such as "100% secure", "fully production-ready", "guaranteed zero bugs", "unbreakable".
- **Why It Failed**: Exaggerated terminology masks residual risks and creates liability while violating engineering rigor.
- **General Rule**: Ban absolute claims. Use precise, technically bounded descriptions (e.g. "atomic idempotency enforced via Firestore transaction", "PBKDF2-HMAC-SHA256 with 100k iterations").
- **Required Pattern**: Replace "100% eliminates race conditions" with "enforces atomic transactions to prevent double-crediting on duplicate idempotency keys".
- **Attack/Test**: Automated linter/grep for banned words in agent outputs.
- **Applies To**: All project documentation, commit messages, and agent narratives.

---

### AGENT-003
- **ID**: `AGENT-003`
- **Context**: Task completion verification and Definition of Done.
- **Failure Pattern**: Task marked DONE immediately after code compiles or tests pass, without running adversarial red team validation.
- **Why It Failed**: Happy-path tests pass, but adversarial edge cases (stolen cookies, forged UIDs, clock skew, expired sessions) were never tested.
- **General Rule**: A task cannot be marked DONE until it passes both positive specification tests AND an adversarial Red Team attack review.
- **Required Pattern**: `Definition of Done v2`: Task Contract $\rightarrow$ Preflight PASS $\rightarrow$ Implementation $\rightarrow$ Tests $\rightarrow$ Critic Review $\rightarrow$ Red Team $\rightarrow$ Build $\rightarrow$ Evidence $\rightarrow$ DONE.
- **Attack/Test**: Execute Red Team Attack Matrix before declaring milestone completion.
- **Applies To**: All feature and security tasks.
