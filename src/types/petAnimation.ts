/**
 * Semantic Animation Contracts for Chú Lười Companion
 * Decouples engine hooks from visual asset implementations (LE-011 preparation).
 */

export type PetAnimationKey =
  | "IDLE_BREATHE"
  | "BLINK"
  | "WAVE"
  | "EAT"
  | "HAPPY_BOUNCE"
  | "CLAP"
  | "THINK"
  | "SLEEP"
  | "WAKE"
  | "STAR_CELEBRATE"
  | "LEVEL_UP"
  | "MASTERY_CELEBRATE"
  | "ENCOURAGE_NOD";

export interface PetAnimationContract {
  key: PetAnimationKey;
  targetDurationMs: number;
  loop: boolean;
  fallbackPose: string;
}

export const PET_ANIMATION_REGISTRY: Record<PetAnimationKey, PetAnimationContract> = {
  IDLE_BREATHE: { key: "IDLE_BREATHE", targetDurationMs: 3000, loop: true, fallbackPose: "idle" },
  BLINK: { key: "BLINK", targetDurationMs: 300, loop: false, fallbackPose: "idle" },
  WAVE: { key: "WAVE", targetDurationMs: 1500, loop: false, fallbackPose: "hello" },
  EAT: { key: "EAT", targetDurationMs: 2500, loop: false, fallbackPose: "eating" },
  HAPPY_BOUNCE: { key: "HAPPY_BOUNCE", targetDurationMs: 2000, loop: false, fallbackPose: "happy" },
  CLAP: { key: "CLAP", targetDurationMs: 2200, loop: false, fallbackPose: "celebrating" },
  THINK: { key: "THINK", targetDurationMs: 2000, loop: false, fallbackPose: "thinking" },
  SLEEP: { key: "SLEEP", targetDurationMs: 4000, loop: true, fallbackPose: "sleeping" },
  WAKE: { key: "WAKE", targetDurationMs: 1500, loop: false, fallbackPose: "hello" },
  STAR_CELEBRATE: { key: "STAR_CELEBRATE", targetDurationMs: 2500, loop: false, fallbackPose: "celebrating" },
  LEVEL_UP: { key: "LEVEL_UP", targetDurationMs: 3000, loop: false, fallbackPose: "celebrating" },
  MASTERY_CELEBRATE: { key: "MASTERY_CELEBRATE", targetDurationMs: 2500, loop: false, fallbackPose: "celebrating" },
  ENCOURAGE_NOD: { key: "ENCOURAGE_NOD", targetDurationMs: 2000, loop: false, fallbackPose: "encourage" },
};
