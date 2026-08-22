import { ThemeId } from "@/types/theme";

/**
 * Semantic Asset Registry
 * Decouples visual asset paths from UI components.
 */
export const ASSET_REGISTRY: Record<string, string> = {
  // Mascot: Cozy Sloth
  "mascot.sloth.cozy.idle": "/assets/mascot/cozy/idle.svg",
  "mascot.sloth.cozy.hello": "/assets/mascot/cozy/hello.svg",
  "mascot.sloth.cozy.happy": "/assets/mascot/cozy/happy.svg",
  "mascot.sloth.cozy.thinking": "/assets/mascot/cozy/thinking.svg",
  "mascot.sloth.cozy.listening": "/assets/mascot/cozy/listening.svg",
  "mascot.sloth.cozy.speaking": "/assets/mascot/cozy/speaking.svg",
  "mascot.sloth.cozy.reading": "/assets/mascot/cozy/reading.svg",
  "mascot.sloth.cozy.writing": "/assets/mascot/cozy/writing.svg",
  "mascot.sloth.cozy.celebrating": "/assets/mascot/cozy/celebrating.svg",
  "mascot.sloth.cozy.sleeping": "/assets/mascot/cozy/sleeping.svg",
  "mascot.sloth.cozy.encourage": "/assets/mascot/cozy/encourage.svg",

  // Mascot: Explorer Sloth
  "mascot.sloth.explorer.idle": "/assets/mascot/explorer/idle.svg",
  "mascot.sloth.explorer.hello": "/assets/mascot/explorer/hello.svg",
  "mascot.sloth.explorer.happy": "/assets/mascot/explorer/happy.svg",
  "mascot.sloth.explorer.thinking": "/assets/mascot/explorer/thinking.svg",
  "mascot.sloth.explorer.listening": "/assets/mascot/explorer/listening.svg",
  "mascot.sloth.explorer.speaking": "/assets/mascot/explorer/speaking.svg",
  "mascot.sloth.explorer.reading": "/assets/mascot/explorer/reading.svg",
  "mascot.sloth.explorer.writing": "/assets/mascot/explorer/writing.svg",
  "mascot.sloth.explorer.celebrating": "/assets/mascot/explorer/celebrating.svg",
  "mascot.sloth.explorer.sleeping": "/assets/mascot/explorer/sleeping.svg",
  "mascot.sloth.explorer.encourage": "/assets/mascot/explorer/encourage.svg",

  // Product Worlds
  "world.cozy.treehouse": "/assets/worlds/cozy_treehouse.svg",
  "world.cozy.library": "/assets/worlds/cozy_library.svg",
  "world.explorer.adventureMap": "/assets/worlds/explorer_adventure_map.svg",
  "world.explorer.storyForest": "/assets/worlds/explorer_story_forest.svg",
  "world.explorer.audioLake": "/assets/worlds/explorer_audio_lake.svg",

  // Skills
  "icon.skill.listening": "/assets/icons/skill_listening.svg",
  "icon.skill.speaking": "/assets/icons/skill_speaking.svg",
  "icon.skill.reading": "/assets/icons/skill_reading.svg",
  "icon.skill.writing": "/assets/icons/skill_writing.svg",
  "icon.skill.vocabulary": "/assets/icons/skill_vocabulary.svg",
  "icon.skill.grammar": "/assets/icons/skill_grammar.svg",

  // Rewards & Pets
  "reward.star": "/assets/rewards/star.svg",
  "reward.xp": "/assets/rewards/xp.svg",
  "reward.coin": "/assets/rewards/coin.svg",
  "reward.pet_food": "/assets/rewards/pet_food.svg",
  "pet.egg.default": "/assets/pets/egg_default.svg",
  "pet.baby.default": "/assets/pets/baby_sloth.svg",
  "pet.sloth.idle": "/assets/pets/sloth_idle.svg",
  "pet.sloth.happy": "/assets/pets/sloth_happy.svg",
  "pet.sloth.proud": "/assets/pets/sloth_proud.svg",
  "pet.sloth.excited": "/assets/pets/sloth_excited.svg",
  "pet.sloth.sleep": "/assets/pets/sloth_sleep.svg",
  "pet.sloth.eat": "/assets/pets/sloth_eat.svg",
  "pet.sloth.think": "/assets/pets/sloth_think.svg",
  "pet.sloth.encourage": "/assets/pets/sloth_encourage.svg",
  "pet.sloth.celebrate": "/assets/pets/sloth_celebrate.svg",
  "pet.sloth.surprised": "/assets/pets/sloth_surprised.svg",
};

/**
 * Resolve semantic asset ID to public path
 */
export function getAssetUrl(semanticId: string, theme?: ThemeId): string {
  if (theme && semanticId.includes("{theme}")) {
    const themedId = semanticId.replace("{theme}", theme);
    return ASSET_REGISTRY[themedId] || `/assets/placeholders/${themedId}.svg`;
  }
  return ASSET_REGISTRY[semanticId] || `/assets/placeholders/${semanticId}.svg`;
}
