/**
 * Server-Authoritative Learning Domain Types (LE-007B)
 */

import { Activity, KnowledgeItem, SkillType } from "./curriculum";
import { MultidimensionalMastery } from "./memory";

export interface RawActivityResponse {
  selectedOptionId?: string;
  typedText?: string;
  userBuiltWords?: string[];
  matchedPairIds?: Array<{ leftId: string; rightId: string }>;
  spokenTranscript?: string;
  audioRecordingDurationMs?: number;
  acknowledged?: boolean;
}

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

export type LessonSessionStatus = "in_progress" | "completed" | "abandoned";

export interface LearningSession {
  id: string;
  sessionId?: string; // Backward compatibility alias for id
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
  version: number;
}

// Backwards compatibility alias
export type LessonSessionState = LearningSession;

export interface ActivityEvaluationResult {
  correct: boolean;
  score: number;
  skill: SkillType;
  knowledgeIds: string[];
  feedbackVi?: string;
  pronunciationScore?: number;
}

export interface ActivityRendererProps {
  activity: Activity;
  knowledgeItems: KnowledgeItem[];
  session: LearningSession;
  onAttempt: (rawResponse: RawActivityResponse, hintsUsed?: number) => Promise<ActivityEvaluationResult | void>;
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
