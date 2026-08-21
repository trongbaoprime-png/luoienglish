# LƯỜI ENGLISH — Dual-Theme System Specification

## 1. Theme Architecture: "One Core UI + Two Themes"

LƯỜI ENGLISH is engineered with a strict **Presentation-Logic Decoupling**:
- There is only **one codebase** for the core learning player, quiz loop, and navigation.
- The UI dynamically renders in one of two themes based on the child's preference:
  1. `cozy` (Cozy Lười)
  2. `explorer` (Explorer Lười)

```
[Student Profile: themePreference = 'cozy' | 'explorer']
                           │
                           ▼
                 [ThemeProvider Context]
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      [Cozy Design Tokens]     [Explorer Design Tokens]
      - Warm Amber / Cream     - Ocean Blue / Gold
      - Treehouse backgrounds  - Adventure Island backgrounds
      - Cozy Sloth mascot skin - Explorer Sloth mascot skin
      - Calming acoustic audio - Energetic punchy audio
```

---

## 2. Design Tokens & Color Palettes

### Theme A: Cozy Lười (`cozy`)
- **Primary**: Warm Honey Amber (`#F59E0B` / `hsl(38, 92%, 50%)`)
- **Secondary**: Sage Green (`#10B981` / `hsl(160, 84%, 39%)`)
- **Background**: Soft Warm Cream (`#FFFBEB` / `hsl(48, 100%, 96%)`)
- **Card Surface**: Pure White with warm amber border (`#FFFFFF`, border `#FDE68A`)
- **Text Primary**: Deep Chestnut (`#451A03` / `hsl(24, 85%, 15%)`)
- **Vibe**: Reading in a warm treehouse with cozy blankets and tea.

### Theme B: Explorer Lười (`explorer`)
- **Primary**: Deep Sky Ocean (`#0284C7` / `hsl(201, 96%, 39%)`)
- **Secondary**: Radiant Gold (`#EAB308` / `hsl(48, 96%, 47%)`)
- **Background**: Fresh Mint Sky (`#F0FDF4` / `hsl(138, 76%, 97%)`)
- **Card Surface**: High-contrast crisp white with royal blue glow (`#FFFFFF`, border `#BAE6FD`)
- **Text Primary**: Navy Midnight (`#0F172A` / `hsl(222, 47%, 11%)`)
- **Vibe**: Embarking on an island expedition with compass, map, and discovery.

---

## 3. Strict Boundary Rules

| Allowed to Change by Theme | Strictly FORBIDDEN to Change by Theme |
| :--- | :--- |
| CSS Variables & Design Tokens | Curriculum data & lesson hierarchy |
| Mascot illustrations & skins | Memory mastery formulas & review intervals |
| Background illustrations & card styling | Server-trusted reward calculations |
| Ambient audio & sound effect assets | AI Gateway prompt logic & speech scoring |
| Animation spring constants (calm vs punchy)| Firestore database schema & API routes |
