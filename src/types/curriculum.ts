/**
 * Curriculum and Content Domain Types
 * Adheres to: Curriculum -> Grade -> Semester -> Unit -> Lesson -> KnowledgeItem -> Activity
 */

export type KnowledgeItemType =
  | "vocabulary"
  | "chunk"
  | "grammar"
  | "pronunciation"
  | "communication_function"
  | "listening_pattern"
  | "reading_pattern"
  | "writing_pattern";

export type AcquisitionStage =
  | "recognize"
  | "recall"
  | "understand"
  | "use"
  | "produce"
  | "transfer";

export type ActivityType =
  | "listen_and_repeat"
  | "word_match"
  | "choose_correct"
  | "fill_in_chunk"
  | "speak_aloud"
  | "mini_conversation"
  | "story_quiz";

export interface KnowledgeItem {
  id: string;
  type: KnowledgeItemType;
  primaryText: string;
  vietnameseMeaning: string;
  phoneticIpa?: string;
  audioKey?: string;
  imageKey?: string;
  exampleSentence?: string;
  targetStage: AcquisitionStage;
  tags?: string[];
}

export interface ActivityOption {
  id: string;
  label: string;
  audioKey?: string;
  imageKey?: string;
  isCorrect: boolean;
  feedbackExplanation?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  prompt: string;
  instructionVi: string;
  knowledgeItemIds: string[];
  audioKey?: string;
  options?: ActivityOption[];
  targetExpectedText?: string;
  hint?: string;
  rewardPoints: {
    stars: number;
    xp: number;
    petFood: number;
  };
}

export interface Lesson {
  id: string;
  unitId: string;
  order: number;
  title: string;
  titleVi: string;
  description: string;
  thumbnailKey?: string;
  knowledgeItems: KnowledgeItem[];
  activities: Activity[];
}

export interface Unit {
  id: string;
  grade: number; // e.g., 3
  semester: 1 | 2;
  order: number;
  topicName: string;
  topicNameVi: string;
  description: string;
  iconKey?: string;
  backgroundKey?: string;
  lessons: Lesson[];
}

export interface CurriculumGrade {
  grade: number; // 1 to 12
  displayName: string;
  description: string;
  targetCefrLevel: string; // e.g. "Pre-A1", "A1", "A2"
  units: Unit[];
}

export interface Curriculum {
  id: string;
  title: string;
  standard: string; // e.g., "Vietnam School Standard"
  grades: CurriculumGrade[];
}
