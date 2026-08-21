/**
 * Adaptive Review & Memory Loop Domain Types (LE-008)
 * Governs:
 * 1. Multidimensional Weakness Detection
 * 2. Forgetting Risk Estimation
 * 3. Contextual Recall Rotation
 * 4. Interleaved Review Session Planning
 * 5. Progression Readiness & Adaptive Difficulty
 */

import { SkillType, RecallContextType, Activity } from "./curriculum";
import { LearningEvidence, LessonSessionStatus } from "./learning";

export type ReviewReason =
  | "OVERDUE"
  | "WEAK_SKILL"
  | "RECENT_FAILURE"
  | "PREREQUISITE_GAP"
  | "FORGETTING_RISK"
  | "TRANSFER_PRACTICE"
  | "REINFORCEMENT"
  | "RECENT_SUCCESS";

export type ReviewDifficulty = "EASIER" | "CURRENT" | "HARDER";

export type ProgressionReadiness =
  | "READY"
  | "READY_WITH_REVIEW"
  | "REINFORCE_PREREQUISITE"
  | "REVIEW_REQUIRED";

export interface ReviewRecommendation {
  childId: string;
  knowledgeId: string;
  priority: number; // 0 to 100
  reason: ReviewReason;
  targetSkill: SkillType;
  difficulty: ReviewDifficulty;
  reviewMode: RecallContextType;
  dueAt: string;
  contextVariantId?: string;
  prerequisiteKnowledgeIds: string[];
  explanationVi: string;
}

export interface DailyReviewQueue {
  childId: string;
  generatedAt: string;
  items: ReviewRecommendation[];
  estimatedMinutes: number;
  reasonSummary: string;
}

export interface ReviewSessionItem {
  id: string;
  knowledgeId: string;
  activity: Activity; // Dynamic Activity generated from Contextual Recall Variant
  recommendation: ReviewRecommendation;
  completed: boolean;
}

export interface ReviewSession {
  id: string;
  childId: string;
  items: ReviewSessionItem[];
  currentActivityIndex: number;
  completedItemIds: string[];
  evidences: LearningEvidence[];
  totalStarsEarned: number;
  totalXpEarned: number;
  totalPetFoodEarned: number;
  heartsRemaining: number;
  maxHearts: number;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
  status: LessonSessionStatus;
  version: number;
}

export interface ForgettingRiskEstimate {
  knowledgeId: string;
  riskScore: number; // 0.0 (low) to 1.0 (imminent forgetting)
  overdueDays: number;
  streakPenalty: number;
  latencyPenalty: number;
}

export interface ExposureRecord {
  knowledgeId: string;
  recentExposureCount: number;
  lastExposureAt: string;
  sameContextCount: number;
  stableMasteryDays: number;
}
