# LƯỜI ENGLISH — Child Safety, Privacy & AI Guardrails

## 1. Core Safety Principles

LƯỜI ENGLISH is designed specifically for children (Ages 6–15). Child safety, emotional well-being, and data privacy are non-negotiable architectural constraints.

---

## 2. Privacy & Data Protection (COPPA / GDPR-K Aligned)

1. **Parent Account Ownership**:
   - All child profiles exist exclusively under an authenticated Parent Account.
   - Child accounts cannot independently make purchases, change privacy settings, or delete records.
2. **Zero Public Child Profiles**:
   - No child names, avatars, scores, or voice recordings are ever exposed publicly.
   - Leaderboards (if present in future phases) use anonymized kid-safe handles (e.g., "Siêu Lười #1024").
3. **Zero Stranger Communication**:
   - No unmoderated peer-to-peer messaging, friend requests, or chatrooms between unknown users.
4. **Data Minimization & Audio Retention**:
   - Audio recordings submitted for pronunciation practice are evaluated transiently and discarded unless the parent explicitly opts in to saved progress clips.

---

## 3. AI Safety & Emotional Guardrails

1. **Server-Side AI Gateway**:
   - Children NEVER interact with raw LLMs. All prompts are constructed server-side with strict safety system prompts.
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

## 4. Content Moderation & Educator Review
- AI-assisted content generators in Admin Content Factory can NEVER publish directly to the live student app without explicit approval from a verified educator.
- All vocabulary and story topics are vetted for age-appropriateness, cultural kindness, and positive values.
