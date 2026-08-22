export class BondPolicy {
  public static readonly MAX_DAILY_FEED_BOND = 10;
  public static readonly MAX_DAILY_PET_BOND = 5;

  /**
   * Calculates bond gain for learning milestones
   */
  public static getLearningBondGain(event: string): number {
    switch (event) {
      case "unit_completed":
        return 10;
      case "weakness_recovered":
        return 5;
      case "lesson_completed":
        return 3;
      case "daily_review_completed":
        return 4;
      case "streak_continued":
        return 2;
      default:
        return 1;
    }
  }

  /**
   * Calculates bond gain for feeding (capped per meal)
   */
  public static getFeedBondGain(): number {
    return 2;
  }

  /**
   * Calculates bond gain for petting (capped per interaction)
   */
  public static getPetBondGain(): number {
    return 1;
  }
}
