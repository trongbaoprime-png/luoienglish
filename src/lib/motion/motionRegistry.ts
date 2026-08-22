import { MotionToken, SemanticMotionKey } from "@/types/motion";

export const MOTION_TOKENS: Record<SemanticMotionKey, MotionToken> = {
  "motion.instant": {
    durationMs: 0,
    easing: "linear",
    cssTransition: "none",
  },
  "motion.fast": {
    durationMs: 150,
    easing: "cubic-bezier(0.4, 0.0, 0.2, 1)",
    cssTransition: "all 150ms cubic-bezier(0.4, 0.0, 0.2, 1)",
  },
  "motion.normal": {
    durationMs: 300,
    easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
    cssTransition: "all 300ms cubic-bezier(0.2, 0.8, 0.2, 1)",
  },
  "motion.slow": {
    durationMs: 600,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    cssTransition: "all 600ms cubic-bezier(0.22, 1, 0.36, 1)",
  },
  "motion.bounce.small": {
    durationMs: 400,
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    cssTransition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  "motion.bounce.medium": {
    durationMs: 700,
    easing: "cubic-bezier(0.18, 1.25, 0.4, 1.1)",
    cssTransition: "transform 700ms cubic-bezier(0.18, 1.25, 0.4, 1.1)",
  },
  "motion.float": {
    durationMs: 3000,
    easing: "ease-in-out",
    cssTransition: "transform 3000ms ease-in-out infinite alternate",
  },
  "motion.breathe": {
    durationMs: 4000,
    easing: "ease-in-out",
    cssTransition: "transform 4000ms ease-in-out infinite alternate",
  },
  "motion.shake.soft": {
    durationMs: 400,
    easing: "cubic-bezier(0.36, 0.07, 0.19, 0.97)",
    cssTransition: "transform 400ms cubic-bezier(0.36, 0.07, 0.19, 0.97)",
  },
  "motion.sparkle": {
    durationMs: 1000,
    easing: "ease-in-out",
    cssTransition: "opacity 1000ms ease-in-out, transform 1000ms ease-in-out",
  },
  "motion.rewardFly": {
    durationMs: 1200,
    easing: "cubic-bezier(0.2, 0.9, 0.3, 1)",
    cssTransition: "all 1200ms cubic-bezier(0.2, 0.9, 0.3, 1)",
  },
  "motion.mapUnlock": {
    durationMs: 1500,
    easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    cssTransition: "stroke-dashoffset 1500ms cubic-bezier(0.25, 1, 0.5, 1)",
  },
};

export class MotionRegistry {
  /**
   * Resolves a semantic motion key with support for reduced motion preferences
   */
  public static getMotion(key: SemanticMotionKey, reducedMotion = false): MotionToken {
    if (reducedMotion) {
      return {
        durationMs: key === "motion.instant" ? 0 : 150,
        easing: "linear",
        cssTransition: "opacity 150ms linear",
      };
    }
    return MOTION_TOKENS[key] || MOTION_TOKENS["motion.normal"];
  }
}
