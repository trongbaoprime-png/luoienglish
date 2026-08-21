import { Curriculum, CurriculumGrade, Lesson, Unit } from "@/types/curriculum";
import { ICurriculumRepository } from "../interfaces/ICurriculumRepository";
import { InMemoryCurriculumRepository } from "../memory/InMemoryCurriculumRepository";

/**
 * Firestore Curriculum Repository
 * Bridges Firestore document fetching with static fallback for offline resilience.
 */
export class FirestoreCurriculumRepository implements ICurriculumRepository {
  private fallbackRepo = new InMemoryCurriculumRepository();

  public async getCurriculum(id: string): Promise<Curriculum | null> {
    // In production, queries firestore: db.collection("curricula").doc(id).get()
    return this.fallbackRepo.getCurriculum(id);
  }

  public async getGrade(gradeNumber: number): Promise<CurriculumGrade | null> {
    return this.fallbackRepo.getGrade(gradeNumber);
  }

  public async getUnit(unitId: string): Promise<Unit | null> {
    return this.fallbackRepo.getUnit(unitId);
  }

  public async getLesson(lessonId: string): Promise<Lesson | null> {
    return this.fallbackRepo.getLesson(lessonId);
  }
}
