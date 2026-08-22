# LƯỜI ENGLISH — Art Direction & Visual Design System

> **Document Version**: 1.0.0  
> **Target Audience**: Product Designers, Illustrators, Frontend Engineers  
> **Core Brand Essence**: Warm, welcoming, encouraging, magical storybook adventure for children.

---

## 1. Visual Philosophy & Core Pillars

1. **Magical Storybook Feel**:
   - Every screen is an illustrated space with depth, soft organic contours, and welcoming character moments.
   - Avoid cold enterprise cards, stark white dashboards, or overwhelming metric grids.
2. **Warmth Over Pressure**:
   - Soft, joyful palettes with sunny warm amber, lush meadow emerald, coral rose, and tranquil sky blue.
   - No harsh red failure screens or casino-style flashing dopamine traps.
3. **Dual-World Exploration**:
   - **Cozy World**: "Ngôi nhà học tập trên cây" — Giant magical banyan tree, treehouse library, lanterns, warm sunbeams, drifting fireflies.
   - **Explorer World**: "Hòn đảo phiêu lưu kiến thức" — Tropical archipelago, wooden rope bridges, hidden waterfalls, jungle camp, secret treasure caves.
4. **Primary Mascot IP**:
   - **Chú Lười** (Friendly Sloth) — exclusively. Zero dinosaur or copied identity. Round expressive eyes, soft contours, slow reassuring presence that removes performance anxiety.

---

## 2. Color Palette & Harmonious Tokens

### Theme A: Cozy Treehouse (Warm Storybook)
- **Primary / Sunlight**: `#F59E0B` (Amber 500) $\to$ `#D97706` (Amber 600)
- **Secondary / Forest**: `#10B981` (Emerald 500) $\to$ `#059669` (Emerald 600)
- **Background Gradient**: `from-[#FFFDF7] via-[#FEF3C7]/40 to-[#FDE68A]/20`
- **Card Surfaces**: `#FFFFFF` with `border: #FDE68A` and soft amber shadow (`0 8px 24px -4px rgba(245, 158, 11, 0.12)`)
- **Accent / Emotion**: `#FB7185` (Rose Coral) and `#8B5CF6` (Magic Violet)

### Theme B: Explorer Island (Tropical Adventure)
- **Primary / Ocean Sky**: `#0EA5E9` (Sky 500) $\to$ `#0284C7` (Sky 600)
- **Secondary / Jungle Gold**: `#FBBF24` (Gold 400) $\to$ `#F59E0B` (Amber 500)
- **Background Gradient**: `from-[#F0F9FF] via-[#E0F2FE]/50 to-[#BAE6FD]/30`
- **Card Surfaces**: `#FFFFFF` with `border: #BAE6FD` and soft ocean shadow (`0 8px 24px -4px rgba(14, 165, 233, 0.14)`)
- **Accent / Discovery**: `#10B981` (Jungle Emerald) and `#F43F5E` (Sunset Ruby)

---

## 3. Typography Architecture

- **Primary Headings**: Rounded font stack (`Outfit`, `Nunito`, `Quicksand`, `system-ui`) with weights 800 (Extrabold) and 900 (Black).
- **Target English Words**: High contrast, bold, distinct font size ($24\text{px} - 36\text{px}$) with phonetic IPA guide ($14\text{px}$ muted).
- **Vietnamese Meaning**: Clear subtitle hierarchy ($15\text{px} - 18\text{px}$) with gentle readability.
- **Action Prompts & Dialogue**: Friendly bubble text with rounded corners ($20\text{px}$ radius).

---

## 4. Visual Hierarchy on Every Screen

Every learning screen must follow the **Single Primary Focus Rule**:
1. **Focus Area** ($60\%$ viewport visual weight): The active learning scene, challenge illustration, or conversation bubble.
2. **Interaction Controls** ($25\%$ visual weight): Clear, large touch targets ($\ge 48\text{px}$) with satisfying tactile bounce.
3. **Context HUD** ($15\%$ visual weight): Minimal top bar displaying Stars ⭐, XP ⚡, Streak 🔥, and Chú Lười pet companion avatar.
