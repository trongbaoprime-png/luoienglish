/**
 * Curriculum, Knowledge Graph & Content Domain Types
 * Adheres to: Curriculum -> Grade -> Semester -> Unit -> Lesson -> LearningObjective -> KnowledgeItem -> Activity
 * 
 * Supports:
 * 1. Vietnam School GDPT 2018 Alignment
 * 2. Global Success Reference Mapping
 * 3. CEFR / Cambridge Young Learners Competencies (Starters, Movers, Flyers)
 * 4. Dual-track evaluation: School Performance vs Natural Communication Competency
 * 5. Reusable Knowledge Graph with multidimensional relationships
 */

export type KnowledgeItemType =
  | "vocabulary"
  | "chunk"
  | "grammar"
  | "phonics"
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

export type CefrLevel = "Pre-A1" | "A1" | "A1+" | "A2" | "B1" | "B2";

export type SkillType =
  | "listening"
  | "speaking"
  | "reading"
  | "writing"
  | "phonics"
  | "grammar"
  | "vocabulary"
  | "communication";

export type KnowledgeEdgeType =
  | "prerequisite"   // Node A must be learned before Node B
  | "reinforces"     // Node B reinforces retention of Node A
  | "related"        // Semantic cousins in same theme
  | "appliesIn"      // Node A is used in real-world scenario B
  | "reviewOf"       // Node B reviews and tests Node A
  | "nextLevel";     // Progressive step (e.g. word -> chunk -> sentence)

export interface KnowledgeRelation {
  targetId: string;
  relationType: KnowledgeEdgeType;
  weight?: number;
  note?: string;
}

export type RecallContextType =
  | "flashcard"
  | "audio_recognition"
  | "conversation"
  | "story"
  | "game"
  | "character_intro"
  | "speaking_challenge"
  | "writing_task";

export interface ContextualRecallVariant {
  id: string;
  contextType: RecallContextType;
  promptText: string;
  promptTextVi: string;
  scenarioDescription: string;
  expectedResponse: string;
  audioKey?: string;
  imageKey?: string;
  scaffoldHint?: string;
}

export interface SchoolAlignment {
  grade: number; // 1 to 12
  semester: 1 | 2;
  moetStandardCode: string; // e.g. "GDPT2018-ENG-G3-U1"
  globalSuccessUnit: number;
  globalSuccessLessonRef: string; // e.g. "Unit 1 - Lesson 1"
  targetGrammarPoint?: string;
}

export interface CommunicationCompetency {
  functionCategory: string; // e.g. "Social Greetings", "Asking Identity", "Polite Inquiries"
  canDoStatementEn: string; // e.g. "Can ask and answer about someone's name in a friendly manner."
  canDoStatementVi: string;
  fluencyExpectation: "word" | "chunk" | "sentence" | "dialogue";
  naturalContextExample: string;
}

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
  skillFocus: SkillType[];
  schoolAlignment: SchoolAlignment;
  communicationCompetency: CommunicationCompetency;
  learningObjectiveIds: string[];
  relations: KnowledgeRelation[];
  recallVariants: ContextualRecallVariant[];
  tags: string[];
}

export interface LearningObjective {
  id: string;
  title: string;
  titleVi: string;
  understandStatement: string; // What should the child understand?
  recognizeStatement: string;  // What should the child recognize?
  sayStatement: string;        // What should the child say?
  hearStatement: string;       // What should the child hear?
  readStatement: string;       // What should the child read?
  writeStatement: string;      // What should the child write?
  realWorldContext: string;    // Where would a child use this in real life?
  cefrLevel: CefrLevel;
  cambridgeStage?: string;     // e.g. "Starters 1"
  primaryKnowledgeItemIds: string[];
}

export type ActivityType =
  | "listen_and_repeat"
  | "word_match"
  | "choose_correct"
  | "fill_in_chunk"
  | "speak_aloud"
  | "mini_conversation"
  | "story_quiz"
  | "phonics_tap"
  | "sentence_builder";

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
  learningObjectives: LearningObjective[];
  knowledgeItems: KnowledgeItem[];
  activities: Activity[];
}

export interface Unit {
  id: string;
  grade: number; // e.g. 3
  semester: 1 | 2;
  order: number;
  topicName: string;
  topicNameVi: string;
  description: string;
  globalSuccessUnitNumber: number;
  cefrTarget: CefrLevel;
  iconKey?: string;
  backgroundKey?: string;
  lessons: Lesson[];
}

export interface CurriculumGrade {
  grade: number; // 1 to 12
  displayName: string;
  description: string;
  targetCefrLevel: CefrLevel;
  units: Unit[];
}

export interface Curriculum {
  id: string;
  title: string;
  standard: string; // e.g., "Vietnam National Curriculum 2018 & Global Success Reference"
  version: string;
  grades: CurriculumGrade[];
  knowledgeGraphNodes?: KnowledgeItem[];
}

/**
 * Context payload for future AI Tutor interactions
 */
export interface AITutorContext {
  currentObjective: LearningObjective;
  knownVocabulary: string[];
  weakKnowledgeIds: string[];
  allowedDifficulty: CefrLevel;
  conversationScenario: string;
  expectedResponse: string;
  scaffoldLevel: 1 | 2 | 3; // 1 = minimal hint, 2 = partial frame, 3 = full scaffold
}
