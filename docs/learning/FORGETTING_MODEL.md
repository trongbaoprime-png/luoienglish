# LƯỜI ENGLISH — Cognitive Forgetting & Decay Estimation Model

> **Version**: 1.0.0 (LE-008)  
> **Component**: `ForgettingRiskEstimator`  

---

## 1. Mathematical & Heuristic Assumptions (V1)

The forgetting risk estimator calculates a normalized score $\mathcal{R} \in [0.0, 1.0]$:

$$\mathcal{R} = \min\left(1.0, \max\left(0.0, R_{\text{overdue}} + P_{\text{streak}} + R_{\text{mastery}} + B_{\text{weakness}}\right)\right)$$

### Parameters:
1. **$R_{\text{overdue}}$ (Overdue Decay)**:
   $$R_{\text{overdue}} = \min(0.5, \Delta_{\text{days}} \times 0.1)$$
2. **$P_{\text{streak}}$ (Fragility Penalty)**:
   - Streak 0: $+0.30$ (unconsolidated memory)
   - Streak 1: $+0.15$
   - Streak 2: $+0.05$
   - Streak $\ge 3$: $0.00$ (stable trace)
3. **$R_{\text{mastery}}$ (Base Vulnerability)**:
   $$R_{\text{mastery}} = \max\left(0, \frac{80 - \text{MasteryScore}}{200}\right)$$
4. **$B_{\text{weakness}}$ (Active Weakness Flag)**:
   - If `isWeakness == true`: $+0.20$
   - Else: $0.00$

---

## 2. Known Limitations & Calibration Roadmap

- **V1 Limitation**: Assumes homogeneous decay rate across different vocabulary types (e.g. concrete nouns vs. grammatical particles).
- **V2 Calibration**: Incorporate empirical cohort response latency ($t_{\text{latency}}$) and error cluster analysis.
