import { StudentProgress } from "@/types/student";
import { IProgressRepository } from "../interfaces/IProgressRepository";

export class InMemoryProgressRepository implements IProgressRepository {
  private progressMap: Map<string, StudentProgress> = new Map();

  public async getProgress(childId: string, lessonId: string): Promise<StudentProgress | null> {
    const key = `${childId}_${lessonId}`;
    return this.progressMap.get(key) || null;
  }

  public async getAllProgressForChild(childId: string): Promise<StudentProgress[]> {
    return Array.from(this.progressMap.values()).filter((p) => p.childId === childId);
  }

  public async saveProgress(progress: StudentProgress): Promise<StudentProgress> {
    const key = `${progress.childId}_${progress.lessonId}`;
    this.progressMap.set(key, progress);
    return progress;
  }
}
