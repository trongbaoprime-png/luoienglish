import { AchievementDefinition } from "@/types/achievement";

export class AchievementPolicy {
  public static readonly ACHIEVEMENTS: AchievementDefinition[] = [
    {
      id: "ach_memory_7days",
      category: "MEMORY",
      titleVi: "Nhớ Dai Như Lười",
      descriptionVi: "Ôn tập thành công một kiến thức sau 7 ngày.",
      iconKey: "icon_brain_spark",
      targetCount: 1,
      reward: { stars: 3, xp: 50, petFood: 2 },
    },
    {
      id: "ach_memory_50items",
      category: "MEMORY",
      titleVi: "Bậc Thầy Trí Nhớ",
      descriptionVi: "Hoàn thành 50 lượt ôn tập thành công.",
      iconKey: "icon_memory_crown",
      targetCount: 50,
      reward: { stars: 10, xp: 200, petFood: 5 },
    },
    {
      id: "ach_speaking_10",
      category: "SPEAKING",
      titleVi: "Nói Không Ngại",
      descriptionVi: "Hoàn thành 10 thử thách phát âm tự tin cùng Chú Lười.",
      iconKey: "icon_mic_star",
      targetCount: 10,
      reward: { stars: 5, xp: 80, petFood: 3 },
    },
    {
      id: "ach_weakness_fixer_3",
      category: "MASTERY",
      titleVi: "Chuyên Gia Sửa Sai",
      descriptionVi: "Khắc phục thành công 3 điểm kiến thức còn yếu.",
      iconKey: "icon_shield_upgrade",
      targetCount: 3,
      reward: { stars: 5, xp: 100, petFood: 4 },
    },
    {
      id: "ach_streak_3days",
      category: "CONSISTENCY",
      titleVi: "Chiến Binh Bền Bỉ",
      descriptionVi: "Học tập liên tục 3 ngày liên tiếp.",
      iconKey: "icon_fire_small",
      targetCount: 3,
      reward: { stars: 3, xp: 60, petFood: 2 },
    },
    {
      id: "ach_streak_7days",
      category: "CONSISTENCY",
      titleVi: "Ngôi Sao Chăm Chỉ",
      descriptionVi: "Học tập liên tục 7 ngày liên tiếp.",
      iconKey: "icon_fire_gold",
      targetCount: 7,
      reward: { stars: 8, xp: 150, petFood: 5 },
    },
    {
      id: "ach_unit_1_complete",
      category: "EXPLORATION",
      titleVi: "Nhà Thám Hiểm Nhí",
      descriptionVi: "Hoàn thành toàn bộ bài học của Unit 1.",
      iconKey: "icon_compass",
      targetCount: 1,
      reward: { stars: 5, xp: 100, petFood: 4 },
    },
    {
      id: "ach_conversation_5",
      category: "SPEAKING",
      titleVi: "Bạn Thân Của Chú Lười",
      descriptionVi: "Hoàn thành 5 đoạn hội thoại tương tác.",
      iconKey: "icon_chat_bubbles",
      targetCount: 5,
      reward: { stars: 5, xp: 100, petFood: 3 },
    },
  ];

  public static getAchievement(id: string): AchievementDefinition | undefined {
    return AchievementPolicy.ACHIEVEMENTS.find((a) => a.id === id);
  }

  public static getAllAchievements(): AchievementDefinition[] {
    return [...AchievementPolicy.ACHIEVEMENTS];
  }
}
