/**
 * Student and Child Profile Domain Types
 */

import { ThemeId } from "./theme";

export type SchoolGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type EnglishLevel = "Pre-A1" | "A1" | "A1+" | "A2" | "B1" | "B2";

export interface UserParent {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  isPinSet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChildPreferences {
  themeId: ThemeId;
  soundEffectsEnabled?: boolean;
  backgroundMusicEnabled?: boolean;
}

export interface ChildProfile {
  id: string;
  parentUid: string;
  nickname: string;
  avatarKey: string;
  schoolGrade: SchoolGrade;
  englishLevel: EnglishLevel;
  preferences: ChildPreferences;
  /**
   * @deprecated Retained for temporary backward compatibility. Use preferences.themeId
   */
  themePreference?: ThemeId;
  dailyGoalMinutes: number;
  totalStudyTimeMinutes: number;
  streakDays: number;
  lastActiveDate: string;
  createdAt: string;
}

export interface StudentProgress {
  id: string;
  childId: string;
  lessonId: string;
  unitId: string;
  isCompleted: boolean;
  completedAt?: string;
  scorePercent: number;
  starsEarned: number;
  xpEarned: number;
  attemptsCount: number;
  lastAttemptAt: string;
}
