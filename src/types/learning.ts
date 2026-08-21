/**
 * Learning Player, Session & Evidence Domain Types (LE-007)
 */

import { Activity, KnowledgeItem, SkillType } from "./curriculum";
import { MultidimensionalMastery } from "./memory";

export interface LearningEvidence {
  childId: string;
  lessonId: string;
  activityId: string;
  knowledgeIds: string[];
  skill: SkillType;
  attemptNumber: number;
  correct: boolean;
  score: number; // 0 to 100
  responseTimeMs: number;
  hintsUsed: number;
  startedAt: string;
  completedAt: string;
  userAnswer?: string | string[];
  transcript?: string;
  pronunciationScore?: number;
}

export type LessonSessionStatus = "not_started" | "in_progress" | "completed" | "abandoned";

export interface LessonSessionState {
  sessionId: string;
  childId: string;
  lessonId: string;
  status: LessonSessionStatus;
  currentActivityIndex: number;
  completedActivityIds: string[];
  evidences: LearningEvidence[];
  totalStarsEarned: number;
  totalXpEarned: number;
  totalPetFoodEarned: number;
  heartsRemaining: number;
  maxHearts: number;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  version: number; // Optimistic concurrency / stale write protection
}

export interface ActivityRendererProps {
  activity: Activity;
  knowledgeItems: KnowledgeItem[];
  session: LessonSessionState;
  onAttempt: (evidence: Omit<LearningEvidence, "childId" | "lessonId" | "activityId" | "knowledgeIds" | "startedAt" | "completedAt">) => void;
  onNext: () => void;
  onHintRequest?: () => void;
  isSubmitting?: boolean;
}

export type ActivityRendererComponent = React.ComponentType<ActivityRendererProps>;

export interface MasteryUpdateResult {
  knowledgeId: string;
  previousScore: number;
  updatedScore: number;
  dimensions: MultidimensionalMastery;
  isWeakness: boolean;
  nextReviewDays: number;
}
