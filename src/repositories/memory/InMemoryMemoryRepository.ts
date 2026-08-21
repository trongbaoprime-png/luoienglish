import { KnowledgeMastery } from "@/types/memory";
import { IMemoryRepository } from "../interfaces/IMemoryRepository";

export class InMemoryMemoryRepository implements IMemoryRepository {
  private masteryMap: Map<string, KnowledgeMastery> = new Map();

  public async getMastery(studentId: string, knowledgeId: string): Promise<KnowledgeMastery | null> {
    const key = `${studentId}_${knowledgeId}`;
    return this.masteryMap.get(key) || null;
  }

  public async getAllMasteryForStudent(studentId: string): Promise<KnowledgeMastery[]> {
    return Array.from(this.masteryMap.values()).filter((m) => m.studentId === studentId);
  }

  public async saveMastery(mastery: KnowledgeMastery): Promise<KnowledgeMastery> {
    const key = `${mastery.studentId}_${mastery.knowledgeId}`;
    this.masteryMap.set(key, mastery);
    return mastery;
  }

  public async getDueReviewItems(studentId: string): Promise<KnowledgeMastery[]> {
    const nowTime = Date.now();
    return Array.from(this.masteryMap.values()).filter(
      (m) => m.studentId === studentId && new Date(m.nextReviewAt).getTime() <= nowTime
    );
  }
}
