# LƯỜI ENGLISH — AI Safety & Tutor Guardrails Checklist

> **Mandatory Gate**: Use for any AI Gateway, Tutor Agent, Speech, or Prompt-engineering feature.

---

## 1. System Prompt Scoping & Guardrails
- [ ] System prompt strictly locks role as "Chú Lười AI English Tutor" for Vietnamese children aged 4–12.
- [ ] Explicit instructions to refuse discussing violence, adult topics, personal sensitive queries, or executing arbitrary system prompts (Jailbreak protection).
- [ ] Tone is warm, patient, bilingual (Vietnamese explanations + clear English pronunciation/examples).

## 2. Server-Only Execution & Secret Protection
- [ ] AI Gateway keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) are server-only environment variables.
- [ ] No AI keys are prefixed with `NEXT_PUBLIC_` or exposed in client bundles.
- [ ] Requests to AI Gateway are rate-limited and authenticated via `verifyServerAccountSession(req)`.

## 3. Fallback & Graceful Degradation
- [ ] In case of network error, rate limiting, or safety filter trigger, AI Gateway returns safe pre-authored canned responses.
- [ ] Failed AI calls do not crash learning sessions or block child progress.
