import { StudentProgress } from "@/types/student";

export interface IProgressRepository {
  getProgress(childId: string, lessonId: string): Promise<StudentProgress | null>;
  getAllProgressForChild(childId: string): Promise<StudentProgress[]>;
  saveProgress(progress: StudentProgress): Promise<StudentProgress>;
}
