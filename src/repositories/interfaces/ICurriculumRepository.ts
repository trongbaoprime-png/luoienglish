import { Curriculum, CurriculumGrade, Lesson, Unit } from "@/types/curriculum";

export interface ICurriculumRepository {
  getCurriculum(id: string): Promise<Curriculum | null>;
  getGrade(gradeNumber: number): Promise<CurriculumGrade | null>;
  getUnit(unitId: string): Promise<Unit | null>;
  getLesson(lessonId: string): Promise<Lesson | null>;
}
