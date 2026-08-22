/**
 * Semantic Audio Registry
 * Manages sound effects, mascot voice clips, and background ambiences.
 */
export const AUDIO_REGISTRY: Record<string, string> = {
  // UI SFX
  "ui.click": "/audio/ui/click.mp3",
  "ui.back": "/audio/ui/back.mp3",
  "ui.correct": "/audio/ui/correct.mp3",
  "ui.wrong": "/audio/ui/wrong.mp3",
  "ui.open": "/audio/ui/open.mp3",
  "ui.close": "/audio/ui/close.mp3",

  // Reward SFX
  "rewards.star": "/audio/rewards/star.mp3",
  "rewards.chest": "/audio/rewards/chest.mp3",
  "rewards.level_up": "/audio/rewards/level_up.mp3",
  "rewards.achievement": "/audio/rewards/achievement.mp3",

  // Mascot & Pet Voice & SFX
  "mascot.hello": "/audio/mascot/hello.mp3",
  "mascot.good_job": "/audio/mascot/good_job.mp3",
  "mascot.try_again": "/audio/mascot/try_again.mp3",
  "mascot.lets_go": "/audio/mascot/lets_go.mp3",
  "pet.greeting": "/audio/pet/greeting.mp3",
  "pet.happy": "/audio/pet/happy.mp3",
  "pet.eat": "/audio/pet/eat.mp3",
  "pet.sleep": "/audio/pet/sleep.mp3",
  "pet.wake": "/audio/pet/wake.mp3",
  "pet.proud": "/audio/pet/proud.mp3",
  "pet.celebrate": "/audio/pet/celebrate.mp3",
  "pet.encourage": "/audio/pet/encourage.mp3",
  "interaction.feed": "/audio/interaction/feed.mp3",
  "interaction.pet": "/audio/interaction/pet.mp3",
  "interaction.play": "/audio/interaction/play.mp3",

  // Ambience (Cozy & Explorer)
  "ambience.treehouse": "/audio/ambience/treehouse.mp3",
  "ambience.rain": "/audio/ambience/rain.mp3",
  "ambience.birds": "/audio/ambience/birds.mp3",
  "ambience.fireflies": "/audio/ambience/fireflies.mp3",
  "ambience.island": "/audio/ambience/island.mp3",
  "ambience.ocean": "/audio/ambience/ocean.mp3",
  "ambience.wind": "/audio/ambience/wind.mp3",
  "ambience.jungle": "/audio/ambience/jungle.mp3",
  "ambience.camp": "/audio/ambience/camp.mp3",
};

/**
 * Resolve semantic audio ID to path or fallback
 */
export function getAudioUrl(semanticId: string): string {
  return AUDIO_REGISTRY[semanticId] || `/audio/placeholder.mp3`;
}
