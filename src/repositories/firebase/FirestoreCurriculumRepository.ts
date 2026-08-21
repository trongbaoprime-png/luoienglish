import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Curriculum, CurriculumGrade, Lesson, Unit } from "@/types/curriculum";
import { ICurriculumRepository } from "../interfaces/ICurriculumRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreCurriculumRepository implements ICurriculumRepository {
  private curriculaCol = "curricula";
  private unitsCol = "units";
  private lessonsCol = "lessons";

  public async getCurriculum(id: string): Promise<Curriculum | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.curriculaCol, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Curriculum;
  }

  public async getGrade(gradeNumber: number): Promise<CurriculumGrade | null> {
    const db = FirebaseClient.getDb();
    // Queries units matching grade
    const q = query(collection(db, this.unitsCol), where("grade", "==", gradeNumber));
    const snap = await getDocs(q);
    const units: Unit[] = [];
    snap.forEach((d) => units.push(d.data() as Unit));

    return {
      grade: gradeNumber,
      displayName: `Lớp ${gradeNumber}`,
      description: `Chương trình tiếng Anh Lớp ${gradeNumber}`,
      targetCefrLevel: gradeNumber <= 2 ? "Pre-A1" : gradeNumber <= 5 ? "A1/A2" : "B1/B2",
      units,
    };
  }

  public async getUnit(unitId: string): Promise<Unit | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.unitsCol, unitId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Unit;
  }

  public async getLesson(lessonId: string): Promise<Lesson | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.lessonsCol, lessonId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Lesson;
  }
}
