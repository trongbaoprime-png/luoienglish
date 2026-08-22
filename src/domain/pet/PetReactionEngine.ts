import { PetInteractionType, PetProfile, PetReaction } from "@/types/pet";
import { MotivationEvent } from "@/types/motivation";
import { PetDialoguePolicy } from "./PetDialoguePolicy";

export class PetReactionEngine {
  /**
   * Generates a semantic reaction from a direct pet interaction
   */
  public static fromInteraction(type: PetInteractionType, pet?: PetProfile): PetReaction {
    const petName = pet?.name || "Chú Lười";

    switch (type) {
      case "FEED": {
        const dlg = PetDialoguePolicy.getDialogue("pet.feed.delicious");
        return {
          emotion: "HAPPY",
          animation: "EAT",
          soundEvent: "pet.eat",
          messageKey: dlg.messageKey,
          speechTextVi: `${petName}: ${dlg.vi}`,
          speechTextEn: dlg.en,
          intensity: "high",
        };
      }
      case "PET": {
        const dlg = PetDialoguePolicy.getDialogue("pet.petting.cozy");
        return {
          emotion: "HAPPY",
          animation: "HAPPY_BOUNCE",
          soundEvent: "pet.happy",
          messageKey: dlg.messageKey,
          speechTextVi: dlg.vi,
          speechTextEn: dlg.en,
          intensity: "medium",
        };
      }
      case "PLAY_SHORT": {
        const dlg = PetDialoguePolicy.getDialogue("pet.petting.happy");
        return {
          emotion: "EXCITED",
          animation: "HAPPY_BOUNCE",
          soundEvent: "interaction.play",
          messageKey: dlg.messageKey,
          speechTextVi: dlg.vi,
          speechTextEn: dlg.en,
          intensity: "medium",
        };
      }
      case "REST":
        return {
          emotion: "SLEEPY",
          animation: "SLEEP",
          soundEvent: "pet.sleep",
          messageKey: "pet.rest",
          speechTextVi: `Khò khò... ${petName} nghỉ một chút để nạp năng lượng nhé...`,
          speechTextEn: "Zzz... Resting to recharge my energy...",
          intensity: "low",
        };
      case "WAKE":
        return {
          emotion: "HAPPY",
          animation: "WAKE",
          soundEvent: "pet.wake",
          messageKey: "pet.wake",
          speechTextVi: "Oa... Chào buổi sáng! Chúng mình sẵn sàng rồi!",
          speechTextEn: "Good morning! Ready for today!",
          intensity: "medium",
        };
      case "WELCOME_BACK": {
        const dlg = PetDialoguePolicy.getDialogue("pet.welcome.back");
        return {
          emotion: "EXCITED",
          animation: "WAVE",
          soundEvent: "pet.greeting",
          messageKey: dlg.messageKey,
          speechTextVi: `Chào mừng bạn quay lại! ${petName} nhớ bạn lắm đấy!`,
          speechTextEn: dlg.en,
          intensity: "high",
        };
      }
      default: {
        const dlg = PetDialoguePolicy.getDialogue("pet.idle.ready");
        return {
          emotion: "HAPPY",
          animation: "IDLE_BREATHE",
          soundEvent: "pet.happy",
          messageKey: dlg.messageKey,
          speechTextVi: `${petName} đã sẵn sàng! Cùng bắt đầu bài học thôi!`,
          speechTextEn: dlg.en,
          intensity: "low",
        };
      }
    }
  }

  /**
   * Generates a semantic reaction from an authoritative learning MotivationEvent
   */
  public static fromLearningEvent(event: MotivationEvent, pet?: PetProfile): PetReaction {
    const payload = event.payload;
    const petName = pet?.name || "Chú Lười";

    if (payload.levelTransition && payload.levelTransition.isLevelUp) {
      const dlg = PetDialoguePolicy.getDialogue("pet.celebrate.level_up");
      return {
        emotion: "CELEBRATING",
        animation: "LEVEL_UP",
        soundEvent: "pet.celebrate",
        messageKey: dlg.messageKey,
        speechTextVi: `${petName} và bạn cùng lên cấp rồi! Tự hào quá đi!`,
        speechTextEn: dlg.en,
        intensity: "high",
      };
    }

    if (payload.isUnitCompleted) {
      const dlg = PetDialoguePolicy.getDialogue("pet.celebrate.unit");
      return {
        emotion: "CELEBRATING",
        animation: "MASTERY_CELEBRATE",
        soundEvent: "pet.celebrate",
        messageKey: dlg.messageKey,
        speechTextVi: dlg.vi,
        speechTextEn: dlg.en,
        intensity: "high",
      };
    }

    if (payload.isWeaknessRemediated) {
      const dlg = PetDialoguePolicy.getDialogue("pet.celebrate.weakness");
      return {
        emotion: "PROUD",
        animation: "CLAP",
        soundEvent: "pet.proud",
        messageKey: dlg.messageKey,
        speechTextVi: dlg.vi,
        speechTextEn: dlg.en,
        intensity: "high",
      };
    }

    if (event.skill === "speaking") {
      const dlg = PetDialoguePolicy.getDialogue("pet.celebrate.speaking");
      return {
        emotion: "EXCITED",
        animation: "HAPPY_BOUNCE",
        soundEvent: "pet.happy",
        messageKey: dlg.messageKey,
        speechTextVi: dlg.vi,
        speechTextEn: dlg.en,
        intensity: "medium",
      };
    }

    // Default lesson completed
    const dlg = PetDialoguePolicy.getDialogue("pet.celebrate.lesson");
    return {
      emotion: "HAPPY",
      animation: "STAR_CELEBRATE",
      soundEvent: "pet.celebrate",
      messageKey: dlg.messageKey,
      speechTextVi: `${petName}: ${dlg.vi}`,
      speechTextEn: dlg.en,
      intensity: "medium",
    };
  }

  /**
   * Generates a non-punitive, warm encouraging reaction when child makes a mistake
   */
  public static forMistake(): PetReaction {
    const dlg = PetDialoguePolicy.getDialogue("pet.encourage.try_again");
    return {
      emotion: "ENCOURAGING",
      animation: "ENCOURAGE_NOD",
      soundEvent: "pet.encourage",
      messageKey: dlg.messageKey,
      speechTextVi: dlg.vi,
      speechTextEn: dlg.en,
      intensity: "low",
    };
  }
}
