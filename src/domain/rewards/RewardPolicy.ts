import { RewardTriggerEvent } from "@/types/reward";
import { DiminishingReturnsPolicy, RepetitionContext } from "./DiminishingReturnsPolicy";

export interface RewardEvaluationContext {
  event: RewardTriggerEvent;
  accuracyScore?: number; // 0 to 100
  consecutiveStreak?: number;
  daysSinceLastReview?: number;
  isWeaknessRemediated?: boolean;
  skill?: "vocabulary" | "listening" | "speaking" | "reading" | "writing" | "conversation";
  repetitionContext?: RepetitionContext;
  difficulty?: "EASIER" | "CURRENT" | "HARDER";
}

export interface ComputedReward {
  stars: number;
  xp: number;
  coins: number;
  petFood: number;
  description: string;
  policyVersion: string;
  multipliers: {
    skill: number;
    spacing: number;
    quality: number;
    antiGrinding: number;
  };
}

export class RewardPolicy {
  public static readonly CURRENT_POLICY_VERSION = "2.0.0-LE-009";

  public static getSkillMultiplier(
    skill?: "vocabulary" | "listening" | "speaking" | "reading" | "writing" | "conversation"
  ): number {
    switch (skill) {
      case "conversation":
        return 2.0;
      case "speaking":
        return 1.8;
      case "writing":
        return 1.5;
      case "listening":
        return 1.2;
      case "reading":
        return 1.2;
      case "vocabulary":
      default:
        return 1.0;
    }
  }

  public static getSpacingMultiplier(daysSinceLastReview = 0): number {
    if (daysSinceLastReview >= 30) return 3.0; // 30+ days durable recall
    if (daysSinceLastReview >= 8) return 2.0;  // 8-14 days spaced recall
    if (daysSinceLastReview >= 4) return 1.5;  // 4-7 days spaced recall
    if (daysSinceLastReview >= 1) return 1.25; // 1-3 days spaced recall
    return 1.0;                                // Same session / within 24h
  }

  public static evaluate(context: RewardEvaluationContext): ComputedReward {
    const policyVersion = RewardPolicy.CURRENT_POLICY_VERSION;
    let baseStars = 0;
    let baseXp = 0;
    let baseCoins = 0;
    let basePetFood = 0;
    let description = "";

    // 1. Calculate Base Rewards from Event Type
    switch (context.event) {
      case "lesson_completed":
        baseStars = 3;
        baseXp = 60;
        baseCoins = 20;
        basePetFood = 3;
        description = "Hoàn thành xuất sắc bài học mới";
        break;

      case "unit_completed":
        baseStars = 10;
        baseXp = 250;
        baseCoins = 100;
        basePetFood = 10;
        description = "Hoàn thành toàn bộ Chủ Đề (Unit Mastery)!";
        break;

      case "review_correct":
      case "spaced_recall_success":
        baseStars = 1;
        baseXp = 25;
        baseCoins = 10;
        basePetFood = 1;
        description = "Ôn tập củng cố trí nhớ cùng Chú Lười";
        break;

      case "daily_review_completed":
        baseStars = 5;
        baseXp = 100;
        baseCoins = 40;
        basePetFood = 4;
        description = "Hoàn thành trọn vẹn phiên ôn tập hôm nay!";
        break;

      case "speaking_completed":
      case "pronunciation_improved":
        baseStars = 2;
        baseXp = 40;
        baseCoins = 15;
        basePetFood = 2;
        description = "Luyện nói tiếng Anh tự tin cùng Chú Lười";
        break;

      case "conversation_transfer":
        baseStars = 3;
        baseXp = 50;
        baseCoins = 25;
        basePetFood = 3;
        description = "Ứng dụng ngôn ngữ tự nhiên trong hội thoại";
        break;

      case "daily_goal_completed":
        baseStars = 4;
        baseXp = 80;
        baseCoins = 30;
        basePetFood = 3;
        description = "Đạt mục tiêu học tập trong ngày";
        break;

      case "streak_continued":
        baseStars = 2;
        baseXp = 40;
        baseCoins = 20;
        basePetFood = 2;
        description = `Duy trì chuỗi học tập ${context.consecutiveStreak || 1} ngày liên tiếp!`;
        break;

      case "achievement_unlocked":
        baseStars = 5;
        baseXp = 120;
        baseCoins = 50;
        basePetFood = 5;
        description = "Mở khóa Huy Hiệu Thành Tích mới!";
        break;

      case "pet_nurtured":
        baseXp = 15;
        baseCoins = 10;
        description = "Chăm sóc và gắn kết cùng Chú Lười";
        break;

      case "lesson_activity_correct":
      default:
        baseStars = 0;
        baseXp = 10;
        baseCoins = 3;
        basePetFood = 0;
        description = "Trả lời đúng câu hỏi";
        break;
    }

    // 2. Multipliers Calculation
    const skillMultiplier = RewardPolicy.getSkillMultiplier(context.skill);
    const spacingMultiplier = RewardPolicy.getSpacingMultiplier(context.daysSinceLastReview);

    let qualityMultiplier = 1.0;
    if (context.accuracyScore && context.accuracyScore >= 90) {
      qualityMultiplier = 1.2;
    }

    const antiGrindingMultiplier = context.repetitionContext
      ? DiminishingReturnsPolicy.calculateMultiplier(context.repetitionContext)
      : 1.0;

    // 3. Apply Multipliers to XP and Coins
    let computedXp = Math.round(
      baseXp * skillMultiplier * spacingMultiplier * qualityMultiplier * antiGrindingMultiplier
    );
    let computedStars = Math.round(baseStars * antiGrindingMultiplier);
    const computedCoins = Math.round(baseCoins * antiGrindingMultiplier);
    let computedPetFood = Math.round(basePetFood * antiGrindingMultiplier);

    // 4. Weakness Recovery Bonus
    if (context.isWeaknessRemediated) {
      computedStars += 2;
      computedXp += 35;
      computedPetFood += 2;
      description += " + Thưởng khắc phục điểm yếu!";
    }

    // 5. Spaced Recall Description Append
    if (spacingMultiplier >= 2.0) {
      description += " + Siêu trí nhớ lâu bền!";
    } else if (spacingMultiplier >= 1.25) {
      description += " + Thưởng ôn tập đúng thời điểm!";
    }

    return {
      stars: Math.max(0, computedStars),
      xp: Math.max(0, computedXp),
      coins: Math.max(0, computedCoins),
      petFood: Math.max(0, computedPetFood),
      description,
      policyVersion,
      multipliers: {
        skill: skillMultiplier,
        spacing: spacingMultiplier,
        quality: qualityMultiplier,
        antiGrinding: antiGrindingMultiplier,
      },
    };
  }
}
