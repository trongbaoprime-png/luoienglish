import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { authorizeChildAccess, ServerAuthError } from "@/services/auth/serverAuth";
import { DailyReviewQueue } from "@/types/adaptiveReview";
import { AdaptiveReviewEngine } from "@/domain/adaptive/AdaptiveReviewEngine";
import { KnowledgeItem } from "@/types/curriculum";

export class DailyReviewService {
  public static async getDailyReviewQueue(
    parentUid: string,
    childId: string
  ): Promise<DailyReviewQueue> {
    const childRepo = RepositoryFactory.getChildRepository();
    const authResult = await authorizeChildAccess(parentUid, childId, childRepo);
    if (!authResult.authorized) {
      throw new ServerAuthError(authResult.error || "Không có quyền truy cập hồ sơ học sinh.", authResult.statusCode || 403);
    }

    const memoryRepo = RepositoryFactory.getMemoryRepository();
    const curriculumRepo = RepositoryFactory.getCurriculumRepository();

    const allKnowledge = await curriculumRepo.getAllKnowledgeItems();
    const knowledgeMap = new Map<string, KnowledgeItem>(allKnowledge.map((k) => [k.id, k]));

    let masteries = await memoryRepo.getAllMasteryForStudent(childId);

    // If fresh student with no recorded mastery yet, seed initial baseline for curriculum items
    if (masteries.length === 0 && allKnowledge.length > 0) {
      const now = new Date().toISOString();
      masteries = allKnowledge.slice(0, 5).map((k) => ({
        id: `m_${childId}_${k.id}`,
        studentId: childId,
        knowledgeId: k.id,
        masteryScore: 45,
        recognitionScore: 50,
        recallScore: 40,
        listeningScore: 50,
        speakingScore: 35, // Speaking baseline
        readingScore: 50,
        writingScore: 40,
        lastSeenAt: now,
        nextReviewAt: now,
        reviewCount: 0,
        consecutiveCorrectStreak: 0,
        isWeakness: true,
      }));
    }

    return AdaptiveReviewEngine.generateDailyQueue(childId, masteries, knowledgeMap);
  }
}
