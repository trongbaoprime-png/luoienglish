# LƯỜI ENGLISH — Motion Design System & Animation Tokens

> **Motion Philosophy**: Meaningful, gentle, organic, communicative. Never chaotic or overwhelming.

---

## 1. Core Motion Tokens

| Token | Duration | Easing Curve | Primary Usage |
| :--- | :--- | :--- | :--- |
| `motion.instant` | 0ms | `linear` | Direct state switches, reduced-motion overrides |
| `motion.fast` | 150ms | `cubic-bezier(0.4, 0.0, 0.2, 1)` | Micro-interactions, button presses, checkmarks |
| `motion.normal` | 300ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Card expansions, speech bubbles, node reveals |
| `motion.slow` | 600ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Screen scene transitions, character entrances |
| `motion.bounceSmall` | 400ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Button release, correct answer badge bounce |
| `motion.bounceMedium`| 700ms | `cubic-bezier(0.18, 1.25, 0.4, 1.1)` | Chú Lười celebration jumps, level-up fanfare |
| `motion.float` | 3000ms | `ease-in-out` (infinite alternate) | Floating clouds, lanterns, fireflies |
| `motion.breathe` | 4000ms | `ease-in-out` (infinite alternate) | Mascot idle breathing, world ambient pulse |
| `motion.shakeSoft` | 400ms | `cubic-bezier(0.36, 0.07, 0.19, 0.97)`| Gentle wobble on wrong answer (never harsh) |
| `motion.rewardFly` | 1200ms | `cubic-bezier(0.2, 0.9, 0.3, 1)` | Stars/XP flying from scene to top HUD counter |
| `motion.mapUnlock` | 1500ms | `cubic-bezier(0.25, 1, 0.5, 1)` | Golden energy trail drawing next path segment |

---

## 2. Reduced Motion & Reduced Stimulation Contract

When `prefers-reduced-motion: reduce` or `child.preferences.reducedStimulation === true`:
- All `motion.float` and `motion.breathe` background loops are disabled (static transforms).
- Flying reward particle trajectories are replaced with direct cross-fades ($150\text{ms}$).
- Parallax scrolling offsets are locked to $0$.
- Screen shake is completely disabled.
- Full pedagogical functionality remains $100\%$ accessible and identical.
