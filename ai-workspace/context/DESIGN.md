# LƯỜI ENGLISH — Design Context for AI Agents

## Mascot Rule
- Mascot: **Chú Lười** (The Sloth).
- Two official visual themes:
  - **Cozy Lười**: Soft, warm, calming, treehouse aesthetic.
  - **Explorer Lười**: Energetic, adventurous, quest aesthetic.
- Absolutely NO dinosaur/Dino mascot references.

## Asset Architecture
- Never use raw file paths like `/images/sloth1.png` in components.
- Always use the semantic asset registry: `getAssetUrl('mascot.sloth.cozy.hello')` or `getAudioUrl('ui.click')`.
