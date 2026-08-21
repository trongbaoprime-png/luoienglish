/**
 * Semantic Asset and Audio Registry Types
 */

import { ThemeId } from "./theme";

export type MascotPose =
  | "idle"
  | "hello"
  | "happy"
  | "thinking"
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "playing"
  | "running"
  | "celebrating"
  | "sleeping"
  | "eating"
  | "pointing"
  | "confused"
  | "encourage";

export type MascotExpression =
  | "smile"
  | "laugh"
  | "excited"
  | "surprised"
  | "confused"
  | "sleepy"
  | "proud"
  | "love";

export type MascotAssetKey = `mascot.sloth.${ThemeId}.${MascotPose}`;

export type AudioCategory =
  | "ui"
  | "rewards"
  | "mascot"
  | "learning"
  | "story"
  | "conversation"
  | "ambience";

export type AudioAssetKey =
  | "ui.click"
  | "ui.back"
  | "ui.correct"
  | "ui.wrong"
  | "ui.open"
  | "ui.close"
  | "rewards.star"
  | "rewards.chest"
  | "rewards.level_up"
  | "rewards.achievement"
  | "mascot.hello"
  | "mascot.good_job"
  | "mascot.try_again"
  | "mascot.lets_go"
  | "ambience.treehouse"
  | "ambience.island"
  | string;
