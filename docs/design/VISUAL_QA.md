# LƯỜI ENGLISH — Visual QA & Regression Standards

> **Purpose**: Maintain high visual excellence, color contrast compliance (WCAG 2.1 AA), and zero visual regression across dual themes and responsive viewports.

---

## 1. Visual QA Checklist

- [ ] **Dual-Theme Verification**:
  - Cozy Treehouse theme exhibits warm amber/cream storybook styling.
  - Explorer Island theme exhibits tropical sky/ocean adventure styling.
  - Theme switch does NOT cause flash of unstyled content or layout shifts.
- [ ] **Viewport Inspection**:
  - Verified on $360\text{px}$, $390\text{px}$, $430\text{px}$, $768\text{px}$, $820\text{px}$, $1024\text{px}$, $1440\text{px}$, $1920\text{px}$.
  - Zero horizontal overflow.
  - Touch targets $\ge 48\text{px}$.
- [ ] **Character & Mascot Integrity**:
  - Chú Lười mascot poses map correctly to learning states.
  - Speech bubbles have sufficient contrast ($\ge 4.5:1$).
- [ ] **Adventure Map Quality**:
  - Winding S-curve trail renders cleanly with connected path segments.
  - All 6 node states (`LOCKED`, `AVAILABLE`, `CURRENT`, `COMPLETED`, `MASTERED`, `REVIEW_DUE`) visually distinct.
- [ ] **Reward & FX Presentation**:
  - Multi-tier celebration overlays (`SMALL`, `MEDIUM`, `BIG`, `EPIC`) scale appropriately.
  - Flying stars/XP animate toward HUD without lagging the main UI thread.
