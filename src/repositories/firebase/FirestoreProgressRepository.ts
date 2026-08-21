import { StudentProgress } from "@/types/student";
import { IProgressRepository } from "../interfaces/IProgressRepository";
import { InMemoryProgressRepository } from "../memory/InMemoryProgressRepository";

export class FirestoreProgressRepository implements IProgressRepository {
  private fallback = new InMemoryProgressRepository();

  public async getProgress(childId: string, lessonId: string): Promise<StudentProgress | null> {
    return this.fallback.getProgress(childId, lessonId);
  }

  public async getAllProgressForChild(childId: string): Promise<StudentProgress[]> {
    return this.fallback.getAllProgressForChild(childId);
  }

  public async saveProgress(progress: StudentProgress): Promise<StudentProgress> {
    return this.fallback.saveProgress(progress);
  }
}
