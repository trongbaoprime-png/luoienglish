/**
 * LƯỜI ENGLISH — Learner Level Progression Policy
 * Scalable XP curve: Level represents consistent effort and mastery over time.
 */

export interface LevelInfo {
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number; // 0 to 100
}

export class LevelPolicy {
  /**
   * Cumulative XP required to reach each level.
   * Level 1: 0 XP
   * Level 2: 100 XP
   * Level 3: 250 XP
   * Level 4: 450 XP
   * Level 5: 700 XP
   * Level N: Base + increment
   */
  public static getRequiredXpForLevel(level: number): number {
    if (level <= 1) return 0;
    // Formula: 50 * level * (level - 1)
    // Level 2: 50 * 2 * 1 = 100
    // Level 3: 50 * 3 * 2 = 300
    // Level 4: 50 * 4 * 3 = 600
    // Level 5: 50 * 5 * 4 = 1000
    return 50 * level * (level - 1);
  }

  public static calculateLevel(totalXp: number): LevelInfo {
    const validXp = Math.max(0, totalXp);

    let level = 1;
    while (validXp >= LevelPolicy.getRequiredXpForLevel(level + 1)) {
      level++;
    }

    const currentLevelBaseXp = LevelPolicy.getRequiredXpForLevel(level);
    const nextLevelBaseXp = LevelPolicy.getRequiredXpForLevel(level + 1);
    const xpInCurrentLevel = validXp - currentLevelBaseXp;
    const xpSpan = nextLevelBaseXp - currentLevelBaseXp;

    const progressPercent =
      xpSpan > 0 ? Math.min(100, Math.floor((xpInCurrentLevel / xpSpan) * 100)) : 100;

    return {
      level,
      currentLevelXp: xpInCurrentLevel,
      nextLevelXp: xpSpan,
      progressPercent,
    };
  }
}
