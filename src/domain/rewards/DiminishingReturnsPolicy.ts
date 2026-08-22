/**
 * LƯỜI ENGLISH — Diminishing Returns & Anti-Grinding Policy
 * Prevents farming easy/trivial items while fully protecting intentional spaced repetition.
 */

export interface RepetitionContext {
  repetitionCountInWindow: number; // How many times this item was practiced in the last 24h
  isSpacedDue: boolean;            // Whether the item is legitimately due for spaced recall
  hoursSinceLastReview?: number;
}

export class DiminishingReturnsPolicy {
  /**
   * Calculates anti-grinding multiplier (0.1 to 1.0).
   * If an item is legitimately due for spaced review, the multiplier is ALWAYS 1.0 (100%).
   */
  public static calculateMultiplier(context: RepetitionContext): number {
    // 1. Spaced review protection: Spaced repetition is NEVER penalized
    if (context.isSpacedDue) {
      return 1.0;
    }

    // 2. Grinding penalty for immediate un-due repetitions within window
    switch (context.repetitionCountInWindow) {
      case 0:
      case 1:
        return 1.0; // 100% full reward for first completion
      case 2:
        return 0.5; // 50% for 2nd repeat within window
      case 3:
        return 0.25; // 25% for 3rd repeat
      default:
        return 0.1; // 10% floor for excessive grinding
    }
  }
}
