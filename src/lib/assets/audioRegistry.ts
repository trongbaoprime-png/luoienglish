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

  // Mascot Voice Clips
  "mascot.hello": "/audio/mascot/hello.mp3",
  "mascot.good_job": "/audio/mascot/good_job.mp3",
  "mascot.try_again": "/audio/mascot/try_again.mp3",
  "mascot.lets_go": "/audio/mascot/lets_go.mp3",

  // Ambience
  "ambience.treehouse": "/audio/ambience/treehouse.mp3",
  "ambience.island": "/audio/ambience/island.mp3",
};

/**
 * Resolve semantic audio ID to path or fallback
 */
export function getAudioUrl(semanticId: string): string {
  return AUDIO_REGISTRY[semanticId] || `/audio/placeholder.mp3`;
}
