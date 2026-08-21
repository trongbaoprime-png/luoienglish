import { standardSchoolCurriculum } from "@/content/curricula";
import { Curriculum, CurriculumGrade, Lesson, Unit } from "@/types/curriculum";
import { ICurriculumRepository } from "../interfaces/ICurriculumRepository";

export class InMemoryCurriculumRepository implements ICurriculumRepository {
  private curriculum: Curriculum = standardSchoolCurriculum;

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
}
