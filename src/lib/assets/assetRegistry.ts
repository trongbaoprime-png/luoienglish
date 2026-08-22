import { ThemeId } from "@/types/theme";

export interface AssetMetadata {
  id: string;
  category: "character" | "world" | "ui" | "reward" | "pet" | "icon" | "fx";
  theme?: ThemeId | "universal";
  state?: string;
  url: string;
  fallbackUrl: string;
  status: "PRODUCTION" | "PROVISIONAL" | "PLACEHOLDER" | "MISSING";
}

/**
 * Semantic Asset Registry
 * Decouples visual asset paths from UI components with 4-tier fallback hierarchy.
 */
export const ASSET_REGISTRY: Record<string, AssetMetadata> = {
  // Mascot: Cozy Sloth
  "mascot.sloth.cozy.idle": {
    id: "mascot.sloth.cozy.idle",
    category: "character",
    theme: "cozy",
    state: "idle",
    url: "/assets/mascot/cozy/idle.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_idle.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.hello": {
    id: "mascot.sloth.cozy.hello",
    category: "character",
    theme: "cozy",
    state: "hello",
    url: "/assets/mascot/cozy/hello.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_hello.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.happy": {
    id: "mascot.sloth.cozy.happy",
    category: "character",
    theme: "cozy",
    state: "happy",
    url: "/assets/mascot/cozy/happy.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_happy.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.thinking": {
    id: "mascot.sloth.cozy.thinking",
    category: "character",
    theme: "cozy",
    state: "thinking",
    url: "/assets/mascot/cozy/thinking.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_thinking.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.listening": {
    id: "mascot.sloth.cozy.listening",
    category: "character",
    theme: "cozy",
    state: "listening",
    url: "/assets/mascot/cozy/listening.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_listening.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.speaking": {
    id: "mascot.sloth.cozy.speaking",
    category: "character",
    theme: "cozy",
    state: "speaking",
    url: "/assets/mascot/cozy/speaking.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_speaking.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.reading": {
    id: "mascot.sloth.cozy.reading",
    category: "character",
    theme: "cozy",
    state: "reading",
    url: "/assets/mascot/cozy/reading.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_reading.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.writing": {
    id: "mascot.sloth.cozy.writing",
    category: "character",
    theme: "cozy",
    state: "writing",
    url: "/assets/mascot/cozy/writing.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_writing.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.celebrating": {
    id: "mascot.sloth.cozy.celebrating",
    category: "character",
    theme: "cozy",
    state: "celebrating",
    url: "/assets/mascot/cozy/celebrating.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_celebrating.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.sleeping": {
    id: "mascot.sloth.cozy.sleeping",
    category: "character",
    theme: "cozy",
    state: "sleeping",
    url: "/assets/mascot/cozy/sleeping.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_sleeping.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.cozy.encourage": {
    id: "mascot.sloth.cozy.encourage",
    category: "character",
    theme: "cozy",
    state: "encourage",
    url: "/assets/mascot/cozy/encourage.svg",
    fallbackUrl: "/assets/placeholders/sloth_cozy_encourage.svg",
    status: "PROVISIONAL",
  },

  // Mascot: Explorer Sloth
  "mascot.sloth.explorer.idle": {
    id: "mascot.sloth.explorer.idle",
    category: "character",
    theme: "explorer",
    state: "idle",
    url: "/assets/mascot/explorer/idle.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_idle.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.hello": {
    id: "mascot.sloth.explorer.hello",
    category: "character",
    theme: "explorer",
    state: "hello",
    url: "/assets/mascot/explorer/hello.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_hello.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.happy": {
    id: "mascot.sloth.explorer.happy",
    category: "character",
    theme: "explorer",
    state: "happy",
    url: "/assets/mascot/explorer/happy.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_happy.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.thinking": {
    id: "mascot.sloth.explorer.thinking",
    category: "character",
    theme: "explorer",
    state: "thinking",
    url: "/assets/mascot/explorer/thinking.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_thinking.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.listening": {
    id: "mascot.sloth.explorer.listening",
    category: "character",
    theme: "explorer",
    state: "listening",
    url: "/assets/mascot/explorer/listening.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_listening.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.speaking": {
    id: "mascot.sloth.explorer.speaking",
    category: "character",
    theme: "explorer",
    state: "speaking",
    url: "/assets/mascot/explorer/speaking.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_speaking.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.reading": {
    id: "mascot.sloth.explorer.reading",
    category: "character",
    theme: "explorer",
    state: "reading",
    url: "/assets/mascot/explorer/reading.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_reading.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.writing": {
    id: "mascot.sloth.explorer.writing",
    category: "character",
    theme: "explorer",
    state: "writing",
    url: "/assets/mascot/explorer/writing.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_writing.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.celebrating": {
    id: "mascot.sloth.explorer.celebrating",
    category: "character",
    theme: "explorer",
    state: "celebrating",
    url: "/assets/mascot/explorer/celebrating.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_celebrating.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.sleeping": {
    id: "mascot.sloth.explorer.sleeping",
    category: "character",
    theme: "explorer",
    state: "sleeping",
    url: "/assets/mascot/explorer/sleeping.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_sleeping.svg",
    status: "PROVISIONAL",
  },
  "mascot.sloth.explorer.encourage": {
    id: "mascot.sloth.explorer.encourage",
    category: "character",
    theme: "explorer",
    state: "encourage",
    url: "/assets/mascot/explorer/encourage.svg",
    fallbackUrl: "/assets/placeholders/sloth_explorer_encourage.svg",
    status: "PROVISIONAL",
  },

  // Worlds
  "world.cozy.treehouse": {
    id: "world.cozy.treehouse",
    category: "world",
    theme: "cozy",
    url: "/assets/worlds/cozy_treehouse.svg",
    fallbackUrl: "/assets/placeholders/world_cozy_treehouse.svg",
    status: "PROVISIONAL",
  },
  "world.cozy.library": {
    id: "world.cozy.library",
    category: "world",
    theme: "cozy",
    url: "/assets/worlds/cozy_library.svg",
    fallbackUrl: "/assets/placeholders/world_cozy_library.svg",
    status: "PROVISIONAL",
  },
  "world.explorer.adventureMap": {
    id: "world.explorer.adventureMap",
    category: "world",
    theme: "explorer",
    url: "/assets/worlds/explorer_adventure_map.svg",
    fallbackUrl: "/assets/placeholders/world_explorer_map.svg",
    status: "PROVISIONAL",
  },
  "world.explorer.storyForest": {
    id: "world.explorer.storyForest",
    category: "world",
    theme: "explorer",
    url: "/assets/worlds/explorer_story_forest.svg",
    fallbackUrl: "/assets/placeholders/world_explorer_story_forest.svg",
    status: "PROVISIONAL",
  },
  "world.explorer.audioLake": {
    id: "world.explorer.audioLake",
    category: "world",
    theme: "explorer",
    url: "/assets/worlds/explorer_audio_lake.svg",
    fallbackUrl: "/assets/placeholders/world_explorer_audio_lake.svg",
    status: "PROVISIONAL",
  },

  // Skills
  "icon.skill.listening": {
    id: "icon.skill.listening",
    category: "icon",
    theme: "universal",
    url: "/assets/icons/skill_listening.svg",
    fallbackUrl: "/assets/placeholders/skill_listening.svg",
    status: "PRODUCTION",
  },
  "icon.skill.speaking": {
    id: "icon.skill.speaking",
    category: "icon",
    theme: "universal",
    url: "/assets/icons/skill_speaking.svg",
    fallbackUrl: "/assets/placeholders/skill_speaking.svg",
    status: "PRODUCTION",
  },
  "icon.skill.reading": {
    id: "icon.skill.reading",
    category: "icon",
    theme: "universal",
    url: "/assets/icons/skill_reading.svg",
    fallbackUrl: "/assets/placeholders/skill_reading.svg",
    status: "PRODUCTION",
  },
  "icon.skill.writing": {
    id: "icon.skill.writing",
    category: "icon",
    theme: "universal",
    url: "/assets/icons/skill_writing.svg",
    fallbackUrl: "/assets/placeholders/skill_writing.svg",
    status: "PRODUCTION",
  },
  "icon.skill.vocabulary": {
    id: "icon.skill.vocabulary",
    category: "icon",
    theme: "universal",
    url: "/assets/icons/skill_vocabulary.svg",
    fallbackUrl: "/assets/placeholders/skill_vocabulary.svg",
    status: "PRODUCTION",
  },
  "icon.skill.grammar": {
    id: "icon.skill.grammar",
    category: "icon",
    theme: "universal",
    url: "/assets/icons/skill_grammar.svg",
    fallbackUrl: "/assets/placeholders/skill_grammar.svg",
    status: "PRODUCTION",
  },

  // Rewards & Pets
  "reward.star": {
    id: "reward.star",
    category: "reward",
    theme: "universal",
    url: "/assets/rewards/star.svg",
    fallbackUrl: "/assets/placeholders/reward_star.svg",
    status: "PRODUCTION",
  },
  "reward.xp": {
    id: "reward.xp",
    category: "reward",
    theme: "universal",
    url: "/assets/rewards/xp.svg",
    fallbackUrl: "/assets/placeholders/reward_xp.svg",
    status: "PRODUCTION",
  },
  "reward.coin": {
    id: "reward.coin",
    category: "reward",
    theme: "universal",
    url: "/assets/rewards/coin.svg",
    fallbackUrl: "/assets/placeholders/reward_coin.svg",
    status: "PRODUCTION",
  },
  "reward.pet_food": {
    id: "reward.pet_food",
    category: "reward",
    theme: "universal",
    url: "/assets/rewards/pet_food.svg",
    fallbackUrl: "/assets/placeholders/reward_pet_food.svg",
    status: "PRODUCTION",
  },
  "pet.egg.default": {
    id: "pet.egg.default",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/egg_default.svg",
    fallbackUrl: "/assets/placeholders/egg_default.svg",
    status: "PROVISIONAL",
  },
  "pet.baby.default": {
    id: "pet.baby.default",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/baby_sloth.svg",
    fallbackUrl: "/assets/placeholders/baby_sloth.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.idle": {
    id: "pet.sloth.idle",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_idle.svg",
    fallbackUrl: "/assets/placeholders/sloth_idle.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.happy": {
    id: "pet.sloth.happy",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_happy.svg",
    fallbackUrl: "/assets/placeholders/sloth_happy.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.proud": {
    id: "pet.sloth.proud",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_proud.svg",
    fallbackUrl: "/assets/placeholders/sloth_proud.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.excited": {
    id: "pet.sloth.excited",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_excited.svg",
    fallbackUrl: "/assets/placeholders/sloth_excited.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.sleep": {
    id: "pet.sloth.sleep",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_sleep.svg",
    fallbackUrl: "/assets/placeholders/sloth_sleep.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.eat": {
    id: "pet.sloth.eat",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_eat.svg",
    fallbackUrl: "/assets/placeholders/sloth_eat.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.think": {
    id: "pet.sloth.think",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_think.svg",
    fallbackUrl: "/assets/placeholders/sloth_think.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.encourage": {
    id: "pet.sloth.encourage",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_encourage.svg",
    fallbackUrl: "/assets/placeholders/sloth_encourage.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.celebrate": {
    id: "pet.sloth.celebrate",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_celebrate.svg",
    fallbackUrl: "/assets/placeholders/sloth_celebrate.svg",
    status: "PROVISIONAL",
  },
  "pet.sloth.surprised": {
    id: "pet.sloth.surprised",
    category: "pet",
    theme: "universal",
    url: "/assets/pets/sloth_surprised.svg",
    fallbackUrl: "/assets/placeholders/sloth_surprised.svg",
    status: "PROVISIONAL",
  },
};

/**
 * Resolves semantic asset ID to public path with 4-tier fallback hierarchy
 */
export function getAssetUrl(semanticId: string, theme?: ThemeId): string {
  let targetId = semanticId;
  if (theme && semanticId.includes("{theme}")) {
    targetId = semanticId.replace("{theme}", theme);
  }

  const asset = ASSET_REGISTRY[targetId];
  if (asset) {
    return asset.url;
  }

  // Tier 3 & 4 Fallbacks
  return `/assets/placeholders/${targetId.replace(/\./g, "_")}.svg`;
}

/**
 * Returns full metadata record for an asset ID
 */
export function getAssetMetadata(semanticId: string): AssetMetadata | null {
  return ASSET_REGISTRY[semanticId] || null;
}

/**
 * Returns array of all registered assets for inspectors and validation
 */
export function listRegisteredAssets(): AssetMetadata[] {
  return Object.values(ASSET_REGISTRY);
}
