import { standardSchoolCurriculum } from "@/content/curricula";
import {
  Curriculum,
  CurriculumGrade,
  Lesson,
  Unit,
  KnowledgeItem,
  LearningObjective,
  SkillType,
} from "@/types/curriculum";
import { ICurriculumRepository } from "../interfaces/ICurriculumRepository";

export class InMemoryCurriculumRepository implements ICurriculumRepository {
  private curriculum: Curriculum = standardSchoolCurriculum;
  private knowledgeMap = new Map<string, KnowledgeItem>();
  private objectiveMap = new Map<string, LearningObjective>();

  constructor() {
    this.indexData();
  }

  private indexData() {
    // Index knowledge items from standalone graph
    for (const item of this.curriculum.knowledgeGraphNodes || []) {
      this.knowledgeMap.set(item.id, item);
    }

    // Index from lessons
    for (const grade of this.curriculum.grades) {
      for (const unit of grade.units) {
        for (const lesson of unit.lessons) {
          for (const obj of lesson.learningObjectives || []) {
            this.objectiveMap.set(obj.id, obj);
          }
          for (const item of lesson.knowledgeItems || []) {
            this.knowledgeMap.set(item.id, item);
          }
        }
      }
    }
  }

  public async getCurriculum(id: string): Promise<Curriculum | null> {
    return this.curriculum.id === id ? this.curriculum : null;
  }

  public async getGrade(gradeNumber: number): Promise<CurriculumGrade | null> {
    const grade = this.curriculum.grades.find((g) => g.grade === gradeNumber);
    return grade || null;
  }

  public async getUnit(unitId: string): Promise<Unit | null> {
    for (const grade of this.curriculum.grades) {
      const unit = grade.units.find((u) => u.id === unitId);
      if (unit) return unit;
    }
    return null;
  }

  public async getLesson(lessonId: string): Promise<Lesson | null> {
    for (const grade of this.curriculum.grades) {
      for (const unit of grade.units) {
        const lesson = unit.lessons.find((l) => l.id === lessonId);
        if (lesson) return lesson;
      }
    }
    return null;
  }

  public async getKnowledgeItem(id: string): Promise<KnowledgeItem | null> {
    return this.knowledgeMap.get(id) || null;
  }

  public async getLearningObjective(id: string): Promise<LearningObjective | null> {
    return this.objectiveMap.get(id) || null;
  }

  public async getPrerequisites(knowledgeId: string): Promise<KnowledgeItem[]> {
    const item = this.knowledgeMap.get(knowledgeId);
    if (!item || !item.relations) return [];

    const prereqIds = item.relations
      .filter((r) => r.relationType === "prerequisite")
      .map((r) => r.targetId);

    return prereqIds
      .map((id) => this.knowledgeMap.get(id))
      .filter((k): k is KnowledgeItem => !!k);
  }

  public async getReinforcingItems(knowledgeId: string): Promise<KnowledgeItem[]> {
    const item = this.knowledgeMap.get(knowledgeId);
    if (!item || !item.relations) return [];

    const reinforceIds = item.relations
      .filter((r) => r.relationType === "reinforces")
      .map((r) => r.targetId);

    return reinforceIds
      .map((id) => this.knowledgeMap.get(id))
      .filter((k): k is KnowledgeItem => !!k);
  }

  public async findKnowledgeBySkill(skill: SkillType): Promise<KnowledgeItem[]> {
    return Array.from(this.knowledgeMap.values()).filter((k) =>
      k.skillFocus?.includes(skill)
    );
  }

  public async getAllKnowledgeItems(): Promise<KnowledgeItem[]> {
    return Array.from(this.knowledgeMap.values());
  }
}
