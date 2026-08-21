import { RewardTriggerEvent } from "@/types/reward";

export interface RewardEvaluationContext {
  event: RewardTriggerEvent;
  accuracyScore?: number;       // 0 to 100
  consecutiveStreak?: number;
  isSpacedRecallBonus?: boolean;
  isWeaknessRemediated?: boolean;
  speakingDurationSeconds?: number;
}

export interface ComputedReward {
  stars: number;
  xp: number;
  coins: number;
  petFood: number;
  description: string;
}

/**
 * Domain-Level Reward Calculation Policy
 * Prioritizes genuine cognitive effort, speaking output, and active recall retention.
 */
export class RewardPolicy {
  public static evaluate(context: RewardEvaluationContext): ComputedReward {
    let stars = 0;
    let xp = 0;
    let coins = 0;
    let petFood = 0;
    let description = "";

    switch (context.event) {
      case "lesson_completed":
        stars = 3;
        xp = 50;
        coins = 20;
        petFood = 2;
        description = "Hoàn thành bài học xuất sắc";
        break;

      case "review_recalled":
        stars = 1;
        xp = 25;
        coins = 10;
        petFood = 1;
        description = "Ôn tập trí nhớ thành công (Active Recall)";
        
        // Bonus for spaced review
        if (context.isSpacedRecallBonus) {
          xp += 15;
          coins += 5;
          description += " + Thưởng nhớ lâu!";
        }
        if (context.isWeaknessRemediated) {
          stars += 1;
          xp += 20;
          description += " + Khắc phục điểm yếu thành công!";
        }
        break;

      case "speaking_target_met":
        stars = 2;
        xp = 35;
        coins = 15;
        petFood = 1;
        description = "Luyện nói tiếng Anh tự tin";
        if (context.accuracyScore && context.accuracyScore >= 90) {
          xp += 15;
          stars += 1;
          description += " (Phát âm chuẩn xác)";
        }
        break;

      case "streak_maintained":
        stars = 2;
        xp = 40;
        coins = 25;
        petFood = 3;
        description = `Duy trì chuỗi học tập ${context.consecutiveStreak || 1} ngày liên tiếp`;
        break;

      case "pet_nurtured":
        xp = 10;
        coins = 5;
        description = "Chăm sóc và gắn kết cùng Chú Lười";
        break;

      case "activity_correct":
      default:
        xp = 5;
        coins = 2;
        description = "Trả lời đúng câu hỏi";
        break;
    }

    return { stars, xp, coins, petFood, description };
  }
}
