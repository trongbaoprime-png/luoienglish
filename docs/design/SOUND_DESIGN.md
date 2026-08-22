# LƯỜI ENGLISH — Sound Design System & AudioMixer Architecture

> **Sound Philosophy**: Warm, organic, acoustic, child-safe.  
> **Non-Negotiable**: No loud buzzers, no casino bells, no audio fatigue.

---

## 1. Sound Taxonomy & Priority Channels

```
Priority 1: [VOICE]      (English pronunciation, vocabulary audio, story narration)
    ↓
Priority 2: [LEARNING]   (Correct chime, try again encourage, phonics tap)
    ↓
Priority 3: [REWARD]     (Star collect, level up fanfare, badge unlock)
    ↓
Priority 4: [UI]         (Button tap, drawer open, tab switch)
    ↓
Priority 5: [AMBIENCE]   (Treehouse breeze, birds, island waves, campfire)
    ↓
Priority 6: [MUSIC]      (Light acoustic guitar & marimba melody)
```

---

## 2. Automatic Ambience Ducking Rule

> [!IMPORTANT]
> Whenever any `VOICE` channel audio plays (e.g. English native pronunciation audio or child speaking evaluation):
> 1. `AMBIENCE` and `MUSIC` gain smoothly ramps down to $20\%$ over $150\text{ms}$.
> 2. Voice audio plays at full crystal-clear fidelity ($100\%$).
> 3. After voice audio ends, `AMBIENCE` and `MUSIC` gain smoothly restores to $100\%$ over $500\text{ms}$.

---

## 3. Semantic Sound Catalog

- **UI Sounds**:
  - `ui.tap`: Soft wooden block click ($60\text{ms}$).
  - `ui.mapNode`: Gentle water bubble pop ($100\text{ms}$).
  - `ui.locked`: Subdued soft thump ($80\text{ms}$).
- **Learning Sounds**:
  - `learning.correct.small`: Soft marimba 2-note ascending chime (`C5 $\to$ G5`).
  - `learning.correct.medium`: Harmonious harp chord with glockenspiel sparkle.
  - `learning.tryAgain`: Gentle warm marimba chord (`F4 $\to$ D4`), non-punitive.
- **Reward Sounds**:
  - `reward.star`: High crystal chime.
  - `reward.starBurst`: Ascending xylophone roll + sparkle swell.
  - `reward.levelUp`: Joyful brass and woodwind fanfare ($2.5\text{s}$).
- **Ambience**:
  - `ambience.cozy.treehouse`: Rustling leaves, distant songbirds, soft wind chimes ($0.25$ default gain).
  - `ambience.explorer.ocean`: Gentle tropical waves, soft breeze ($0.25$ default gain).
