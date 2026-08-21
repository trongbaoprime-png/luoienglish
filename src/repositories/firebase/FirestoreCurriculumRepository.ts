import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  Curriculum,
  CurriculumGrade,
  Lesson,
  Unit,
  KnowledgeItem,
  LearningObjective,
  SkillType,
  CefrLevel,
} from "@/types/curriculum";
import { ICurriculumRepository } from "../interfaces/ICurriculumRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

export class FirestoreCurriculumRepository implements ICurriculumRepository {
  private curriculaCol = "curricula";
  private unitsCol = "units";
  private lessonsCol = "lessons";
  private knowledgeCol = "knowledgeItems";
  private objectivesCol = "learningObjectives";

  public async getCurriculum(id: string): Promise<Curriculum | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.curriculaCol, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Curriculum;
  }

  public async getGrade(gradeNumber: number): Promise<CurriculumGrade | null> {
    const db = FirebaseClient.getDb();
    const q = query(collection(db, this.unitsCol), where("grade", "==", gradeNumber));
    const snap = await getDocs(q);
    const units: Unit[] = [];
    snap.forEach((d) => units.push(d.data() as Unit));

    const targetCefrLevel: CefrLevel =
      gradeNumber <= 2 ? "Pre-A1" : gradeNumber <= 4 ? "A1" : "A2";

    return {
      grade: gradeNumber,
      displayName: `Lớp ${gradeNumber}`,
      description: `Chương trình tiếng Anh Lớp ${gradeNumber}`,
      targetCefrLevel,
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

  public async getKnowledgeItem(id: string): Promise<KnowledgeItem | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.knowledgeCol, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as KnowledgeItem;
  }

  public async getLearningObjective(id: string): Promise<LearningObjective | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.objectivesCol, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as LearningObjective;
  }

  public async getPrerequisites(knowledgeId: string): Promise<KnowledgeItem[]> {
    const item = await this.getKnowledgeItem(knowledgeId);
    if (!item || !item.relations) return [];

    const prereqIds = item.relations
      .filter((r) => r.relationType === "prerequisite")
      .map((r) => r.targetId);

    const items: KnowledgeItem[] = [];
    for (const pId of prereqIds) {
      const p = await this.getKnowledgeItem(pId);
      if (p) items.push(p);
    }
    return items;
  }

  public async getReinforcingItems(knowledgeId: string): Promise<KnowledgeItem[]> {
    const item = await this.getKnowledgeItem(knowledgeId);
    if (!item || !item.relations) return [];

    const reinforceIds = item.relations
      .filter((r) => r.relationType === "reinforces")
      .map((r) => r.targetId);

    const items: KnowledgeItem[] = [];
    for (const rId of reinforceIds) {
      const r = await this.getKnowledgeItem(rId);
      if (r) items.push(r);
    }
    return items;
  }

  public async findKnowledgeBySkill(skill: SkillType): Promise<KnowledgeItem[]> {
    const db = FirebaseClient.getDb();
    const q = query(
      collection(db, this.knowledgeCol),
      where("skillFocus", "array-contains", skill)
    );
    const snap = await getDocs(q);
    const items: KnowledgeItem[] = [];
    snap.forEach((d) => items.push(d.data() as KnowledgeItem));
    return items;
  }

  public async getAllKnowledgeItems(): Promise<KnowledgeItem[]> {
    const db = FirebaseClient.getDb();
    const snap = await getDocs(collection(db, this.knowledgeCol));
    const items: KnowledgeItem[] = [];
    snap.forEach((d) => items.push(d.data() as KnowledgeItem));
    return items;
  }
}
