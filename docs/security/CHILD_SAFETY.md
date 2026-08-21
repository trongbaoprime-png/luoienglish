# LƯỜI ENGLISH — Child Safety, Multi-Tenant Privacy & AI Guardrails

> **CRITICAL ARCHITECTURAL NOTICE**:  
> Current AI safety guardrails, prompt structures, and mock providers represent a **Foundational Scaffolding** for Phase 0. They are **NOT YET production-complete**. Dedicated moderation classifiers, automated PII scrubbing models, and educator review escalation systems must be fully certified before public student rollout.

---

## 1. Core Safety & Data Ownership Principles

LƯỜI ENGLISH is designed specifically for children (Ages 6–15). Child safety, emotional well-being, and multi-tenant data privacy are non-negotiable architectural constraints.

---

## 2. Multi-Tenant Child Data Ownership & Firestore Security Model

1. **Parent-Only Access to Child Profiles**:
   - All child profiles (`children/{childId}`) belong strictly to an authenticated parent (`parentUid`).
   - Parents have exclusive authority to create, read, and update profiles, including child theme preferences (`children/{childId}.preferences.themeId`).
   - Cross-parent access is strictly blocked by Firestore Security Rules.
2. **Child-Scoped Document Isolation**:
   - Every child-owned document (`studentProgress`, `knowledgeMastery`, `pets`, `rewardBalances`, `rewardTransactions`) resolves ownership back to `children/{childId}.parentUid`.
   - Generic authenticated users (`isAuthenticated()`) CANNOT access or mutate data belonging to other children/parents.
3. **Server-Trusted Reward Ledger**:
   - Direct client writes to `rewardTransactions` and `rewardBalances` are blocked at the database level (`allow write: if false`).
   - Rewards are calculated and written exclusively by server-side Cloud Functions / API routes using Firebase Admin SDK under atomic transaction semantics.
   - Client read access to transactions and balances is strictly limited to the parent owning that specific child.
4. **Zero Public Child Profiles & Zero Stranger Communication**:
   - No child names, avatars, scores, or voice recordings are ever exposed publicly.
   - Leaderboards (if present in future phases) use anonymized kid-safe handles (e.g., "Siêu Lười #1024").
   - No unmoderated peer-to-peer messaging, friend requests, or public chatrooms.
5. **Data Minimization & Transient Audio Retention**:
   - Audio recordings submitted for pronunciation practice are evaluated transiently and discarded unless the parent explicitly opts in to saved progress clips.

---

## 3. Theme Persistence & Rollback Integrity
- The child profile in Firestore (`children/{childId}.preferences.themeId`) is the authoritative **Single Source of Truth** for authenticated children.
- Local storage is utilized strictly as a client-side cache for instant zero-flicker rendering.
- If persistence to Firestore fails (network outage or permission denial), the client application explicitly rolls back optimistic theme state, updates `syncStatus: "error"`, and allows retry, preventing silent cache desynchronization.

---

## 4. AI Safety & Emotional Guardrails

1. **Server-Side AI Gateway**:
   - Children NEVER interact directly with raw third-party LLMs. All prompts are constructed server-side with strict safety system prompts.
2. **Anti-Dependency & Healthy Screen Time**:
   - Chú Lười is a friendly companion, but never pretends to be a real human or encourages emotional dependency.
   - Built-in gentle break reminders after 25 minutes of continuous learning.
3. **No Sensitive Information Solicitation**:
   - The AI system prompt strictly forbids asking the child for their real full name, address, school name, phone number, or family details.
4. **Pedagogical Scaffolding (No Direct Feeding)**:
   - When a child asks for help, Chú Lười provides scaffolded clues:
     `Hint 1` → `Hint 2` → `Example` → `Explanation`.
   - Never simply blurt out test answers without encouraging active recall.

---

## 5. Production Release Safety Requirements (Future Gate)
Before launching AI features in production:
1. Real-time child safety classification layer (Google Cloud DLP / Perspective / custom regex filter).
2. Human educator audit logs for flagged conversational turns.
3. Hard circuit-breakers for anomalous token usage or conversational loops.
