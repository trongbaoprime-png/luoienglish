import { ChildDailyGoals, DailyGoalItem } from "@/types/dailyGoal";

export class DailyGoalPolicy {
  public static generateDefaultGoals(childId: string, dateStr: string): ChildDailyGoals {
    const goals: DailyGoalItem[] = [
      {
        id: "goal_review",
        type: "COMPLETE_DAILY_REVIEW",
        titleVi: "Ôn Tập Trí Nhớ",
        descriptionVi: "Hoàn thành 1 phiên ôn tập hàng ngày cùng Chú Lười.",
        targetCount: 1,
        currentCount: 0,
        isCompleted: false,
        reward: { stars: 2, xp: 40, petFood: 2 },
      },
      {
        id: "goal_vocab",
        type: "LEARN_NEW_VOCABULARY",
        titleVi: "Thu Thập Từ Vựng",
        descriptionVi: "Học hoặc ôn luyện 5 từ vựng tiếng Anh.",
        targetCount: 5,
        currentCount: 0,
        isCompleted: false,
        reward: { stars: 2, xp: 30, petFood: 2 },
      },
      {
        id: "goal_speak",
        type: "SPEAK_PRACTICE",
        titleVi: "Luyện Nói Tự Tin",
        descriptionVi: "Hoàn thành 3 thử thách phát âm hoặc nói cùng Chú Lười.",
        targetCount: 3,
        currentCount: 0,
        isCompleted: false,
        reward: { stars: 3, xp: 50, petFood: 2 },
      },
    ];

    return {
      childId,
      dateStr,
      goals,
      allCompleted: false,
      bonusClaimed: false,
      bonusReward: {
        stars: 5,
        xp: 100,
        petFood: 4,
      },
      updatedAt: new Date().toISOString(),
    };
  }
}
