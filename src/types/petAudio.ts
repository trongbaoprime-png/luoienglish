/**
 * Semantic Audio & Ambience Contracts for Pet Companion
 * Supports volume, mute, reduced stimulation, and theme-based ambient soundscapes.
 */

export type PetAudioKey =
  | "pet.greeting"
  | "pet.happy"
  | "pet.eat"
  | "pet.sleep"
  | "pet.wake"
  | "pet.proud"
  | "pet.celebrate"
  | "pet.encourage"
  | "interaction.feed"
  | "interaction.pet"
  | "interaction.play";

export type AmbienceAudioKey =
  // Cozy Theme
  | "ambience.treehouse"
  | "ambience.rain"
  | "ambience.birds"
  | "ambience.fireflies"
  // Explorer Theme
  | "ambience.ocean"
  | "ambience.wind"
  | "ambience.jungle"
  | "ambience.camp";

export interface PetAudioContract {
  key: PetAudioKey | AmbienceAudioKey;
  category: "sfx" | "voice" | "ambience";
  defaultVolume: number; // 0.0 - 1.0
  loop?: boolean;
}
