import { GrowthStage } from "@/types/pet";

export interface StageThreshold {
  stage: GrowthStage;
  titleVi: string;
  titleEn: string;
  minXp: number;
  minBond: number;
  descriptionVi: string;
}

export class GrowthPolicy {
  public static readonly STAGES: StageThreshold[] = [
    {
      stage: "baby",
      titleVi: "Lười Nhí",
      titleEn: "Baby Sloth",
      minXp: 0,
      minBond: 0,
      descriptionVi: "Bé Lười đáng yêu mới bắt đầu làm quen với bảng chữ cái.",
    },
    {
      stage: "young",
      titleVi: "Lười Tinh Nghịch",
      titleEn: "Young Sloth",
      minXp: 200,
      minBond: 25,
      descriptionVi: "Chú Lười đã nhớ nhiều từ vựng và tự tin phát âm.",
    },
    {
      stage: "adventurer",
      titleVi: "Lười Phiêu Lưu",
      titleEn: "Adventurer Sloth",
      minXp: 600,
      minBond: 50,
      descriptionVi: "Chú Lười sẵn sàng khám phá các bài đọc và câu chuyện dài.",
    },
    {
      stage: "explorer",
      titleVi: "Lười Thám Hiểm",
      titleEn: "Explorer Sloth",
      minXp: 1500,
      minBond: 75,
      descriptionVi: "Người bạn đồng hành giao tiếp tiếng Anh tự nhiên và lưu loát.",
    },
    {
      stage: "wise_sloth",
      titleVi: "Lười Thông Thái",
      titleEn: "Wise Sloth",
      minXp: 3000,
      minBond: 90,
      descriptionVi: "Biểu tượng trí tuệ và sự kiên trì bền bỉ trên hành trình học tập.",
    },
  ];

  /**
   * Growth stage requires BOTH cumulative Learning XP AND Bond.
   * Prevents spamming food or mini-games to bypass learning progression.
   */
  public static calculateGrowthStage(xp: number, bond: number): GrowthStage {
    for (let i = GrowthPolicy.STAGES.length - 1; i >= 0; i--) {
      const threshold = GrowthPolicy.STAGES[i]!;
      if (xp >= threshold.minXp && bond >= threshold.minBond) {
        return threshold.stage;
      }
    }
    return "baby";
  }

  public static getStageInfo(stage: GrowthStage): StageThreshold {
    return (
      GrowthPolicy.STAGES.find((s) => s.stage === stage) ||
      GrowthPolicy.STAGES[0]!
    );
  }

  public static getNextStage(currentStage: GrowthStage): StageThreshold | null {
    const currentIndex = GrowthPolicy.STAGES.findIndex((s) => s.stage === currentStage);
    if (currentIndex >= 0 && currentIndex < GrowthPolicy.STAGES.length - 1) {
      return GrowthPolicy.STAGES[currentIndex + 1]!;
    }
    return null;
  }
}
