export interface DialogueEntry {
  messageKey: string;
  vi: string;
  en: string;
}

export class PetDialoguePolicy {
  private static readonly DIALOGUES: Record<string, DialogueEntry> = {
    // Feeding
    "pet.feed.delicious": {
      messageKey: "pet.feed.delicious",
      vi: "Ngon quá! Chú Lười no bụng rồi, cảm ơn bạn nhé!",
      en: "Yummy! That was delicious, thank you!",
    },
    "pet.feed.happy": {
      messageKey: "pet.feed.happy",
      vi: "Món ăn ngon tuyệt! Chúng mình cùng học tiếp nào!",
      en: "Tastes so good! Let's keep learning together!",
    },

    // Petting
    "pet.petting.cozy": {
      messageKey: "pet.petting.cozy",
      vi: "Thích quá đi! Lười yêu bạn nhất trên đời!",
      en: "That feels so cozy! I love learning with you!",
    },
    "pet.petting.happy": {
      messageKey: "pet.petting.happy",
      vi: "Xoa đầu thích thật đấy! Hôm nay mình học bài gì nhỉ?",
      en: "Hehe that tickles! What should we explore today?",
    },

    // Learning Celebrations
    "pet.celebrate.lesson": {
      messageKey: "pet.celebrate.lesson",
      vi: "Hoan hô! Bạn vừa hoàn thành bài học xuất sắc!",
      en: "Hooray! Outstanding work on your lesson!",
    },
    "pet.celebrate.speaking": {
      messageKey: "pet.celebrate.speaking",
      vi: "Bạn phát âm chuẩn và tự tin lắm luôn!",
      en: "Your pronunciation was so clear and confident!",
    },
    "pet.celebrate.weakness": {
      messageKey: "pet.celebrate.weakness",
      vi: "Tuyệt đỉnh! Chúng mình đã chinh phục từ khó rồi!",
      en: "Awesome! We mastered that tricky word!",
    },
    "pet.celebrate.unit": {
      messageKey: "pet.celebrate.unit",
      vi: "Chúc mừng bạn đã hoàn thành cả một chương học kỳ diệu!",
      en: "Congratulations! You finished the entire unit!",
    },
    "pet.celebrate.level_up": {
      messageKey: "pet.celebrate.level_up",
      vi: "Cả hai chúng mình cùng lên cấp rồi này! Tự hào quá đi!",
      en: "Level up! Look how much we've grown together!",
    },

    // Encouragement after mistakes (Non-punitive)
    "pet.encourage.try_again": {
      messageKey: "pet.encourage.try_again",
      vi: "Không sao đâu! Sai là để nhớ lâu hơn, thử lại cùng Lười nhé!",
      en: "It's totally okay! Mistakes help us learn, let's try again!",
    },
    "pet.encourage.thinking": {
      messageKey: "pet.encourage.thinking",
      vi: "Gần đúng rồi đấy! Bạn nhớ lại một chút xem nào!",
      en: "You're so close! Take a moment and try one more time!",
    },

    // Welcome Back
    "pet.welcome.back": {
      messageKey: "pet.welcome.back",
      vi: "Chào mừng bạn quay lại! Chú Lười nhớ bạn lắm đấy!",
      en: "Welcome back! I missed you so much!",
    },

    // Idle
    "pet.idle.ready": {
      messageKey: "pet.idle.ready",
      vi: "Lười đã sẵn sàng rồi! Cùng bắt đầu bài học thôi!",
      en: "I'm ready! Let's start our English adventure!",
    },
  };

  public static getDialogue(key: string): DialogueEntry {
    return (
      PetDialoguePolicy.DIALOGUES[key] || {
        messageKey: key,
        vi: "Cùng học tiếng Anh thật vui với Chú Lười nhé!",
        en: "Let's have fun learning English together!",
      }
    );
  }
}
