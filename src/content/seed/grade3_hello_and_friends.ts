/**
 * Re-export Grade 3 seed datasets from domain/curriculum/seedGrade3.ts
 * Maintains full backwards compatibility with legacy seed paths.
 */

import {
  knowledgeItemsGrade3,
  lessonG3U1L1,
  unitGrade3Unit1,
} from "@/domain/curriculum/seedGrade3";

export const grade3KnowledgeItems = knowledgeItemsGrade3;
export const sampleLesson1 = lessonG3U1L1;
export const sampleUnit1 = unitGrade3Unit1;
