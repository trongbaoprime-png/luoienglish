# LƯỜI ENGLISH — Responsive Student UX & Breakpoint Architecture

> **Target Devices**: Mobile Phones ($360\text{px} - 430\text{px}$), Tablets ($768\text{px} - 820\text{px}$), Desktop/Chromebooks ($1024\text{px} - 1920\text{px}$).

---

## 1. Breakpoint Breakdown & Adaptive Layout Rules

| Viewport | Dimension Width | Layout Strategy |
| :--- | :--- | :--- |
| **Mobile Compact** | $360\text{px} - 390\text{px}$ | Vertical stacked scene, bottom action sheet, full-width touch targets ($\ge 48\text{px}$), compact top HUD. |
| **Mobile Large** | $390\text{px} - 430\text{px}$ | Comfortable padding, larger mascot avatar, prominent speech bubbles. |
| **Tablet Portrait / Landscape** | $768\text{px} - 820\text{px}$ | Dual-column or expansive scene layout with Chú Lười mascot standing alongside interactive question area. |
| **Desktop / Laptop** | $1024\text{px} - 1920\text{px}$ | Centered container ($\max 1200\text{px}$), rich environmental sidebars, atmospheric background layers. |

---

## 2. Touch & Ergonomic Guardrails

- **Minimum Touch Target**: $48\text{px} \times 48\text{px}$ with minimum $12\text{px}$ spacing between clickable items.
- **Thumb Zone Friendly**: Primary "Tiếp tục" / "Kiểm tra" button placed in bottom natural thumb reach zone on mobile devices.
- **Zero Horizontal Scroll**: Strict `overflow-x: hidden` across all student pages.
- **Safe Area Insets**: Full support for iOS notch (`safe-area-inset-top`, `safe-area-inset-bottom`) and Android navigation bar.
