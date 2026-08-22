import { RewardAudioCue } from "@/lib/audio/rewardAudioEvents";
import { AchievementDefinition } from "@/types/achievement";

export type CelebrationIntensity = "NONE" | "SMALL" | "MEDIUM" | "BIG" | "EPIC";
export type MascotReaction =
  | "HAPPY"
  | "PROUD"
  | "EXCITED"
  | "ENCOURAGING"
  | "CELEBRATE"
  | "THINKING";

export interface RewardPresentationOptions {
  starsEarned: number;
  xpEarned: number;
  petFoodEarned: number;
  isCorrect?: boolean;
  levelUp?: { oldLevel: number; newLevel: number };
  achievementUnlocked?: AchievementDefinition;
  weaknessRecovered?: boolean;
  isUnitCompleted?: boolean;
  isDailyReviewCompleted?: boolean;
}

export interface RewardPresentation {
  starsEarned: number;
  xpEarned: number;
  petFoodEarned: number;
  celebrationIntensity: CelebrationIntensity;
  mascotReaction: MascotReaction;
  audioCue: RewardAudioCue;
  levelUp?: { oldLevel: number; newLevel: number };
  achievementUnlocked?: AchievementDefinition;
  weaknessRecovered?: boolean;
  messageVi: string;
}

export class RewardPresentationMapper {
  public static mapToPresentation(options: RewardPresentationOptions): RewardPresentation {
    const {
      starsEarned,
      xpEarned,
      petFoodEarned,
      isCorrect = true,
      levelUp,
      achievementUnlocked,
      weaknessRecovered,
      isUnitCompleted,
      isDailyReviewCompleted,
    } = options;

    // 1. If incorrect answer
    if (!isCorrect) {
      return {
        starsEarned: 0,
        xpEarned: 0,
        petFoodEarned: 0,
        celebrationIntensity: "NONE",
        mascotReaction: "ENCOURAGING",
        audioCue: "mascot.encouraging",
        messageVi: "Chú Lười tin con sẽ làm tốt hơn ở lần thử tiếp theo!",
      };
    }

    // 2. EPIC Celebration (Unit Completed or Major Achievement)
    if (isUnitCompleted) {
      return {
        starsEarned,
        xpEarned,
        petFoodEarned,
        celebrationIntensity: "EPIC",
        mascotReaction: "CELEBRATE",
        audioCue: "mascot.celebrate",
        levelUp,
        achievementUnlocked,
        weaknessRecovered,
        messageVi: "Tuyệt vời! Con đã hoàn thành xuất sắc toàn bộ Chủ Đề!",
      };
    }

    // 3. BIG Celebration (Level Up, Achievement Unlocked, Weakness Recovered)
    if (levelUp) {
      return {
        starsEarned,
        xpEarned,
        petFoodEarned,
        celebrationIntensity: "BIG",
        mascotReaction: "EXCITED",
        audioCue: "level.up",
        levelUp,
        achievementUnlocked,
        weaknessRecovered,
        messageVi: `Chúc mừng con đã thăng cấp lên Cấp Độ ${levelUp.newLevel}!`,
      };
    }

    if (achievementUnlocked) {
      return {
        starsEarned,
        xpEarned,
        petFoodEarned,
        celebrationIntensity: "BIG",
        mascotReaction: "EXCITED",
        audioCue: "achievement.unlock",
        achievementUnlocked,
        messageVi: `Mở khóa huy hiệu mới: ${achievementUnlocked.titleVi}!`,
      };
    }

    if (weaknessRecovered) {
      return {
        starsEarned,
        xpEarned,
        petFoodEarned,
        celebrationIntensity: "BIG",
        mascotReaction: "PROUD",
        audioCue: "weakness.recovered",
        weaknessRecovered: true,
        messageVi: "Tuyệt quá! Con đã khắc phục thành công điểm khó khăn!",
      };
    }

    // 4. MEDIUM Celebration (Daily Review Completed)
    if (isDailyReviewCompleted) {
      return {
        starsEarned,
        xpEarned,
        petFoodEarned,
        celebrationIntensity: "MEDIUM",
        mascotReaction: "PROUD",
        audioCue: "reward.star.big",
        messageVi: "Hoàn thành xuất sắc phiên ôn tập hôm nay!",
      };
    }

    // 5. SMALL Celebration (Standard Correct Answer)
    return {
      starsEarned,
      xpEarned,
      petFoodEarned,
      celebrationIntensity: starsEarned > 0 ? "SMALL" : "NONE",
      mascotReaction: "HAPPY",
      audioCue: starsEarned > 0 ? "reward.star.small" : "reward.xp",
      messageVi: "Đúng rồi! Cùng tiếp tục phát huy nhé!",
    };
  }
}
