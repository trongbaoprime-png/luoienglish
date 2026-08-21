/**
 * Cognitive Memory Engine Types (Active Recall & Spaced Repetition)
 */

export interface KnowledgeMastery {
  id: string;
  studentId: string;
  knowledgeId: string;
  
  // Cognitive dimension scores (0 to 100)
  recognitionScore: number;
  recallScore: number;
  listeningScore: number;
  speakingScore: number;
  readingScore: number;
  writingScore: number;

  masteryScore: number; // Aggregate (0 to 100)
  
  lastSeenAt: string;
  nextReviewAt: string;
  reviewCount: number;
  consecutiveCorrectStreak: number;
  isWeakness: boolean;
}

export interface ReviewQueueItem {
  knowledgeId: string;
  mastery: KnowledgeMastery;
  priorityWeight: number;
  urgencyReason: "due_for_review" | "weakness_detected" | "new_item_consolidation";
}

export interface MemoryScheduleInput {
  masteryScore: number;
  isCorrect: boolean;
  reviewCount: number;
  latencySeconds?: number;
}

export interface MemoryScheduleResult {
  nextReviewDays: number;
  updatedMasteryScore: number;
  isWeakness: boolean;
}
