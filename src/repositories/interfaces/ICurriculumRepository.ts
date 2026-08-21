import {
  Curriculum,
  CurriculumGrade,
  Lesson,
  Unit,
  KnowledgeItem,
  LearningObjective,
  SkillType,
} from "@/types/curriculum";

export interface ICurriculumRepository {
  getCurriculum(id: string): Promise<Curriculum | null>;
  getGrade(gradeNumber: number): Promise<CurriculumGrade | null>;
  getUnit(unitId: string): Promise<Unit | null>;
  getLesson(lessonId: string): Promise<Lesson | null>;
  getKnowledgeItem(id: string): Promise<KnowledgeItem | null>;
  getLearningObjective(id: string): Promise<LearningObjective | null>;
  getPrerequisites(knowledgeId: string): Promise<KnowledgeItem[]>;
  getReinforcingItems(knowledgeId: string): Promise<KnowledgeItem[]>;
  findKnowledgeBySkill(skill: SkillType): Promise<KnowledgeItem[]>;
  getAllKnowledgeItems(): Promise<KnowledgeItem[]>;
}
