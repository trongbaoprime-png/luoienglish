# LƯỜI ENGLISH — Progression Readiness & Advancement Policy

> **Version**: 1.0.0 (LE-008)  
> **Component**: `ProgressionReadinessPolicy`  

---

## 1. Readiness Categories

The progression policy answers whether a student is ready to unlock the next Unit or Adventure Map node:

| Readiness Status | Condition | Pedagogical Action |
| :--- | :--- | :--- |
| **`READY`** | Prerequisite mastery $\ge 50$, active weakness count $= 0$. | Proceed directly to next lesson. |
| **`READY_WITH_REVIEW`** | Prerequisites met, but $1 \le \text{weaknesses} \le 3$. | Allow progression while scheduling interleaved review items in daily queue. |
| **`REINFORCE_PREREQUISITE`** | Core prerequisite knowledge item has mastery $< 50$ or active weakness. | Suggest brief prerequisite review challenge before starting advanced lesson. |
| **`REVIEW_REQUIRED`** | $\ge 4$ active weaknesses across current curriculum grade. | Recommend a consolidation review session to prevent cognitive overload. |

---

## 2. Child-Friendly UX & Anti-Punitive Design

- **No Failure Shaming**: We never present red warning alerts or demoralizing labels.
- **Chú Lười Encouragement**:
  - *"Bé làm rất tốt! Chú Lười có thêm một thử thách nhỏ để cùng bé ôn lại trước khi qua bài mới nhé!"*
- **Theme Independence**: Progression readiness calculations evaluate identical underlying cognitive models regardless of whether the student is on the Cozy or Explorer theme.
