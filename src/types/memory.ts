/**
 * Cognitive Memory Engine Types (Active Recall & Spaced Repetition)
 * Multidimensional Mastery Model for LƯỜI ENGLISH
 */

import { RecallContextType } from "./curriculum";

export interface MultidimensionalMastery {
  // Individual cognitive skill scores (0 to 100)
  recognitionMastery: number;
  listeningMastery: number;
  speakingMastery: number;
  readingMastery: number;
  writingMastery: number;
  pronunciationMastery: number;
  applicationMastery: number;

  // Dual-Track evaluation scores (0 to 100)
  schoolCurriculumScore: number;       // Mastery of standard school test / grammar requirements
  communicationCompetencyScore: number; // Real natural fluency & communicative application

  // Overall aggregate mastery score (0 to 100)
  aggregateMasteryScore: number;
}

export interface KnowledgeMastery {
  id: string;
  studentId: string;
  knowledgeId: string;
  
  // Multidimensional breakdown
  dimensions?: MultidimensionalMastery;
  
  // Legacy / Direct access properties for backward compatibility
  masteryScore: number; // Mirrors dimensions.aggregateMasteryScore
  recognitionScore: number;
  recallScore: number;
  listeningScore: number;
  speakingScore: number;
  readingScore: number;
  writingScore: number;

  lastSeenAt: string;
  nextReviewAt: string;
  reviewCount: number;
  consecutiveCorrectStreak: number;
  isWeakness: boolean;
  lastRecallContext?: RecallContextType;
}

export interface ReviewQueueItem {
  knowledgeId: string;
  mastery: KnowledgeMastery;
  priorityWeight: number;
  urgencyReason: "due_for_review" | "weakness_detected" | "new_item_consolidation";
  recommendedContext: RecallContextType;
}

export interface MemoryScheduleInput {
  masteryScore: number;
  isCorrect: boolean;
  reviewCount: number;
  skillType?: "listening" | "speaking" | "reading" | "writing" | "pronunciation" | "recognition" | "application";
  latencySeconds?: number;
  recallContext?: RecallContextType;
}

export interface MemoryScheduleResult {
  nextReviewDays: number;
  updatedMasteryScore: number;
  isWeakness: boolean;
  updatedDimensions?: Partial<MultidimensionalMastery>;
}
