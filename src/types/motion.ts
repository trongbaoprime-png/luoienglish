/**
 * Semantic Motion & Animation Tokens
 */

export type MotionSpeed = "instant" | "fast" | "normal" | "slow";

export interface MotionToken {
  durationMs: number;
  easing: string;
  cssTransition: string;
}

export type SemanticMotionKey =
  | "motion.instant"
  | "motion.fast"
  | "motion.normal"
  | "motion.slow"
  | "motion.bounce.small"
  | "motion.bounce.medium"
  | "motion.float"
  | "motion.breathe"
  | "motion.shake.soft"
  | "motion.sparkle"
  | "motion.rewardFly"
  | "motion.mapUnlock";
