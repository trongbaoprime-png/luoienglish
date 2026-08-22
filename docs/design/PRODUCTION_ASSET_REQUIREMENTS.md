# LƯỜI ENGLISH — Production Asset Requirements (Input for LE-011)

> **Document Version**: 1.0.0  
> **Target Milestone**: LE-011 (First Vertical Slice & Production Art Integration)  
> **Design Philosophy**: Warm, inspiring, child-friendly, sloth IP (*Chú Lười*), zero dinosaur identity.  

---

## 0. Production Visual Rule

> [!CRITICAL]
> **"Placeholder UI is NOT Production Visual."**  
> Emoji, generic Lucide icons, simple CSS circles, and temporary flat gradients used during early architectural milestones must NEVER be interpreted as finished production art. LE-011 systematically integrates the handcrafted visual, animation, and audio assets specified below.

---

## 1. Character & Mascot Assets (`mascot.sloth.*`)

| Asset ID | Purpose | Theme | State | Aspect Ratio | Dimensions | Format | Animation Hook | Audio Hook | Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `mascot.sloth.cozy.idle` | Default companion pose in Cozy room | Cozy | Idle | 1:1 | 512x512 | SVG / WebP | `IDLE_BREATHE` | — | Vector SVG |
| `mascot.sloth.cozy.hello` | Welcome and greeting | Cozy | Active | 1:1 | 512x512 | SVG / Lottie | `WAVE` | `mascot.hello` | Vector SVG |
| `mascot.sloth.cozy.happy` | Positive feedback on correct answer | Cozy | Active | 1:1 | 512x512 | SVG / Lottie | `HAPPY_BOUNCE` | `mascot.good_job` | Vector SVG |
| `mascot.sloth.cozy.thinking` | Guidance during question or puzzle | Cozy | Focused | 1:1 | 512x512 | SVG / Lottie | `THINK` | — | Vector SVG |
| `mascot.sloth.cozy.speaking` | Speaking activity prompt | Cozy | Active | 1:1 | 512x512 | SVG / Lottie | `HAPPY_BOUNCE` | `mascot.lets_go` | Vector SVG |
| `mascot.sloth.cozy.eating` | Pet feeding response | Cozy | Active | 1:1 | 512x512 | SVG / Lottie | `EAT` | `pet.eat` | Vector SVG |
| `mascot.sloth.cozy.sleeping` | Low energy resting state | Cozy | Sleeping | 1:1 | 512x512 | SVG / Lottie | `SLEEP` | `pet.sleep` | Vector SVG |
| `mascot.sloth.cozy.celebrating` | Level up & milestone celebration | Cozy | Celebration | 1:1 | 512x512 | SVG / Lottie | `LEVEL_UP` | `pet.celebrate` | Vector SVG |
| `mascot.sloth.cozy.encourage` | Supportive reaction after mistake | Cozy | Caring | 1:1 | 512x512 | SVG / Lottie | `ENCOURAGE_NOD` | `pet.encourage` | Vector SVG |
| `mascot.sloth.explorer.idle` | Default companion in Island camp | Explorer | Idle | 1:1 | 512x512 | SVG / WebP | `IDLE_BREATHE` | — | Vector SVG |
| `mascot.sloth.explorer.hello` | Greeting on Island | Explorer | Active | 1:1 | 512x512 | SVG / Lottie | `WAVE` | `mascot.hello` | Vector SVG |
| `mascot.sloth.explorer.celebrating` | Treasure discovery / Unit complete | Explorer | Celebration | 1:1 | 512x512 | SVG / Lottie | `STAR_CELEBRATE`| `pet.celebrate` | Vector SVG |

---

## 2. World & Environment Assets (`world.*`)

| Asset ID | Purpose | Theme | Aspect Ratio | Dimensions | Format | Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `world.cozy.treehouse` | Main background for Cozy learning hub | Cozy | 16:9 | 1920x1080 | SVG / WebP | Gradient backdrop |
| `world.cozy.library` | Background for vocabulary & stories | Cozy | 16:9 | 1920x1080 | SVG / WebP | Wood interior |
| `world.explorer.adventureMap`| Island map background with navigation nodes | Explorer | 16:9 / Scroll | 2560x1440 | SVG / WebP | Vector map |
| `world.explorer.storyForest` | Storytelling & reading world | Explorer | 16:9 | 1920x1080 | SVG / WebP | Jungle backdrop |
| `world.explorer.audioLake` | Listening & speaking arena | Explorer | 16:9 | 1920x1080 | SVG / WebP | Water backdrop |

---

## 3. UI & Currency Assets (`reward.*`, `icon.*`)

| Asset ID | Purpose | Dimensions | Format | Audio Hook | Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `reward.star` | Core mastery star currency ⭐ | 128x128 | SVG / Animated WebP | `rewards.star` | CSS Star |
| `reward.xp` | Experience point badge ⚡ | 128x128 | SVG | `reward.xp` | CSS Zap |
| `reward.pet_food` | Chú Lười food icon 🍎 | 128x128 | SVG | `reward.petFood` | CSS Apple |
| `reward.coin` | Exploration token 🪙 | 128x128 | SVG | `rewards.star` | CSS Circle |
| `reward.chest.wood` | Daily goal reward chest | 256x256 | SVG / Lottie | `rewards.chest` | Card |
| `reward.chest.gold` | Unit completion chest | 256x256 | SVG / Lottie | `rewards.level_up`| Card |
| `icon.skill.listening` | Skill indicator for Listening | 64x64 | SVG | — | Lucide Headphones |
| `icon.skill.speaking` | Skill indicator for Speaking | 64x64 | SVG | — | Lucide Mic |
| `icon.skill.reading` | Skill indicator for Reading | 64x64 | SVG | — | Lucide BookOpen |
| `icon.skill.writing` | Skill indicator for Writing | 64x64 | SVG | — | Lucide Edit3 |
| `icon.skill.vocabulary`| Skill indicator for Vocabulary | 64x64 | SVG | — | Lucide Sparkles |
| `icon.skill.grammar` | Skill indicator for Grammar | 64x64 | SVG | — | Lucide Layers |

---

## 4. Pet Growth Stages & Cosmetics (`pet.*`)

| Asset ID | Growth Stage | Description | Format | Animation | Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `pet.stage.baby` | Baby Sloth | Small, fluffy, sitting on small cushion | SVG / WebP | `IDLE_BREATHE` | Baby Sloth SVG |
| `pet.stage.young` | Young Sloth | Energetic, wearing small headband | SVG / WebP | `HAPPY_BOUNCE` | Young Sloth SVG |
| `pet.stage.adventurer`| Adventurer Sloth | Carrying miniature backpack | SVG / WebP | `CLAP` | Adventurer Sloth SVG |
| `pet.stage.explorer`| Explorer Sloth | Wearing explorer vest & compass | SVG / WebP | `STAR_CELEBRATE`| Explorer Sloth SVG |
| `pet.stage.wise_sloth`| Wise Sloth | Wearing graduation cap & glasses | SVG / WebP | `MASTERY_CELEBRATE`| Wise Sloth SVG |
| `cosmetic.hat.knit_cap`| Cozy knitted beanie | Hat accessory | SVG | — | Vector item |
| `cosmetic.hat.explorer_hat`| Explorer safari hat | Hat accessory | SVG | — | Vector item |
| `cosmetic.outfit.scarf`| Red warm scarf | Neck accessory | SVG | — | Vector item |

---

## 5. Animation Contracts (`src/types/petAnimation.ts`)

| Animation Key | Target Duration | Loop | Primary Purpose |
| :--- | :--- | :--- | :--- |
| `IDLE_BREATHE` | 3000ms | Yes | Natural lifelike idle state |
| `BLINK` | 300ms | No | Spontaneous eye blink |
| `WAVE` | 1500ms | No | Greeting on page open / welcome back |
| `EAT` | 2500ms | No | Munching food animation on Feed |
| `HAPPY_BOUNCE` | 2000ms | No | Joyful response to petting & play |
| `CLAP` | 2200ms | No | Applauding correct answers & milestones |
| `THINK` | 2000ms | No | Pondering animation during hints |
| `SLEEP` | 4000ms | Yes | Gentle breathing while resting |
| `WAKE` | 1500ms | No | Yawning and stretching on wake |
| `STAR_CELEBRATE` | 2500ms | No | Star burst celebration |
| `LEVEL_UP` | 3000ms | No | Big level up fanfare |
| `MASTERY_CELEBRATE`| 2500ms | No | Golden aura upon concept mastery |
| `ENCOURAGE_NOD` | 2000ms | No | Gentle nod and warm smile on retry |

---

## 6. Audio SFX & Ambience Contracts (`src/types/petAudio.ts`)

| Audio Key | Category | Default Volume | Loop | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `ui.click` | SFX | 0.6 | No | Soft wooden tap on button click |
| `ui.correct` | SFX | 0.8 | No | Uplifting musical chime on correct answer |
| `ui.wrong` | SFX | 0.5 | No | Gentle low marimba chime on mistake (never harsh buzzer) |
| `rewards.star` | SFX | 0.8 | No | Twinkling star collection chime |
| `rewards.level_up` | SFX | 0.9 | No | Brass & flute fanfare on level transition |
| `rewards.achievement` | SFX | 0.9 | No | Triumphant chord on badge unlock |
| `pet.greeting` | Voice | 0.8 | No | Friendly "Hello!" voice clip from Chú Lười |
| `pet.happy` | Voice / SFX | 0.8 | No | Playful chuckle / purr |
| `pet.eat` | SFX | 0.7 | No | Cute crunching sound |
| `pet.sleep` | SFX | 0.4 | Yes | Soft rhythmic breathing |
| `pet.celebrate` | Voice | 0.9 | No | "Great job!" celebration clip |
| `pet.encourage` | Voice | 0.7 | No | "Let's try again!" warm voice clip |
| `ambience.treehouse` | Ambience | 0.3 | Yes | Soft rustling leaves & warm fire crackle |
| `ambience.rain` | Ambience | 0.3 | Yes | Gentle raindrops on treehouse roof |
| `ambience.ocean` | Ambience | 0.3 | Yes | Gentle tropical island waves & sea breeze |
| `ambience.wind` | Ambience | 0.25 | Yes | Whistling wind through island palms |
