import { AudioChannel } from "@/lib/audio/AudioMixer";

export interface SoundMetadata {
  id: string;
  category: "UI" | "LEARNING" | "REWARD" | "PET" | "WORLD" | "AMBIENCE" | "VOICE";
  channel: AudioChannel;
  url: string;
  durationMs?: number;
  descriptionVi: string;
  status: "PRODUCTION" | "PROVISIONAL" | "PLACEHOLDER";
}

export const SOUND_REGISTRY: Record<string, SoundMetadata> = {
  // UI Sounds
  "ui.tap": {
    id: "ui.tap",
    category: "UI",
    channel: "SFX",
    url: "/audio/ui/tap.mp3",
    durationMs: 80,
    descriptionVi: "Tiếng gõ gỗ nhẹ khi chạm nút",
    status: "PROVISIONAL",
  },
  "ui.mapNode": {
    id: "ui.mapNode",
    category: "UI",
    channel: "SFX",
    url: "/audio/ui/map_node.mp3",
    durationMs: 120,
    descriptionVi: "Tiếng bong bóng nước khi chạm nút bản đồ",
    status: "PROVISIONAL",
  },
  "ui.locked": {
    id: "ui.locked",
    category: "UI",
    channel: "SFX",
    url: "/audio/ui/locked.mp3",
    durationMs: 100,
    descriptionVi: "Âm thanh trầm nhẹ khi chạm bài học chưa mở khóa",
    status: "PROVISIONAL",
  },

  // Learning Feedback
  "learning.correct.small": {
    id: "learning.correct.small",
    category: "LEARNING",
    channel: "SFX",
    url: "/audio/learning/correct_small.mp3",
    durationMs: 400,
    descriptionVi: "Tiếng marimba 2 nốt ngân vang khi trả lời đúng",
    status: "PROVISIONAL",
  },
  "learning.correct.medium": {
    id: "learning.correct.medium",
    category: "LEARNING",
    channel: "SFX",
    url: "/audio/learning/correct_medium.mp3",
    durationMs: 700,
    descriptionVi: "Hợp âm chuông hạc khi hoàn thành câu hỏi lớn",
    status: "PROVISIONAL",
  },
  "learning.tryAgain": {
    id: "learning.tryAgain",
    category: "LEARNING",
    channel: "SFX",
    url: "/audio/learning/try_again.mp3",
    durationMs: 500,
    descriptionVi: "Âm thanh ấm áp động viên khi chọn chưa đúng",
    status: "PROVISIONAL",
  },

  // Rewards
  "reward.star": {
    id: "reward.star",
    category: "REWARD",
    channel: "SFX",
    url: "/audio/rewards/star.mp3",
    durationMs: 500,
    descriptionVi: "Tiếng lách cách thu thập sao",
    status: "PRODUCTION",
  },
  "reward.levelUp": {
    id: "reward.levelUp",
    category: "REWARD",
    channel: "SFX",
    url: "/audio/rewards/level_up.mp3",
    durationMs: 2500,
    descriptionVi: "Khúc quân hành kèn đồng vui nhộn khi lên cấp",
    status: "PRODUCTION",
  },
  "reward.achievement": {
    id: "reward.achievement",
    category: "REWARD",
    channel: "SFX",
    url: "/audio/rewards/achievement.mp3",
    durationMs: 2000,
    descriptionVi: "Âm vang mở khóa huy hiệu mới",
    status: "PRODUCTION",
  },

  // Mascot & Pet
  "pet.greeting": {
    id: "pet.greeting",
    category: "PET",
    channel: "VOICE",
    url: "/audio/pet/greeting.mp3",
    durationMs: 1200,
    descriptionVi: "Tiếng chào mừng thân mật của Chú Lười",
    status: "PROVISIONAL",
  },
  "pet.eat": {
    id: "pet.eat",
    category: "PET",
    channel: "SFX",
    url: "/audio/pet/eat.mp3",
    durationMs: 1500,
    descriptionVi: "Tiếng nhai táo giòn rụm",
    status: "PROVISIONAL",
  },
  "pet.celebrate": {
    id: "pet.celebrate",
    category: "PET",
    channel: "SFX",
    url: "/audio/pet/celebrate.mp3",
    durationMs: 1800,
    descriptionVi: "Tiếng Chú Lười vỗ tay reo hò",
    status: "PROVISIONAL",
  },

  // Ambiences
  "ambience.cozy.treehouse": {
    id: "ambience.cozy.treehouse",
    category: "AMBIENCE",
    channel: "AMBIENCE",
    url: "/audio/ambience/treehouse.mp3",
    durationMs: 30000,
    descriptionVi: "Gió luồn qua tán lá và tiếng chim hót nhẹ nhàng",
    status: "PROVISIONAL",
  },
  "ambience.explorer.ocean": {
    id: "ambience.explorer.ocean",
    category: "AMBIENCE",
    channel: "AMBIENCE",
    url: "/audio/ambience/ocean.mp3",
    durationMs: 30000,
    descriptionVi: "Sóng biển nhiệt đới vỗ bờ cát êm đềm",
    status: "PROVISIONAL",
  },
};

export function getSoundUrl(id: string): string {
  return SOUND_REGISTRY[id]?.url || "/audio/placeholder.mp3";
}

export function getSoundMetadata(id: string): SoundMetadata | null {
  return SOUND_REGISTRY[id] || null;
}

export function listRegisteredSounds(): SoundMetadata[] {
  return Object.values(SOUND_REGISTRY);
}
