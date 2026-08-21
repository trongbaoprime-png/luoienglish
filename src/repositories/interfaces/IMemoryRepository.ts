import { KnowledgeMastery } from "@/types/memory";

export interface IMemoryRepository {
  getMastery(studentId: string, knowledgeId: string): Promise<KnowledgeMastery | null>;
  getAllMasteryForStudent(studentId: string): Promise<KnowledgeMastery[]>;
  saveMastery(mastery: KnowledgeMastery): Promise<KnowledgeMastery>;
  getDueReviewItems(studentId: string): Promise<KnowledgeMastery[]>;
}
