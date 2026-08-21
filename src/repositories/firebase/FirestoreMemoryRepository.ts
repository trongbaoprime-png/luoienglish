import { KnowledgeMastery } from "@/types/memory";
import { IMemoryRepository } from "../interfaces/IMemoryRepository";
import { InMemoryMemoryRepository } from "../memory/InMemoryMemoryRepository";

export class FirestoreMemoryRepository implements IMemoryRepository {
  private fallback = new InMemoryMemoryRepository();

  public async getMastery(studentId: string, knowledgeId: string): Promise<KnowledgeMastery | null> {
    return this.fallback.getMastery(studentId, knowledgeId);
  }

  public async getAllMasteryForStudent(studentId: string): Promise<KnowledgeMastery[]> {
    return this.fallback.getAllMasteryForStudent(studentId);
  }

  public async saveMastery(mastery: KnowledgeMastery): Promise<KnowledgeMastery> {
    return this.fallback.saveMastery(mastery);
  }

  public async getDueReviewItems(studentId: string): Promise<KnowledgeMastery[]> {
    return this.fallback.getDueReviewItems(studentId);
  }
}
