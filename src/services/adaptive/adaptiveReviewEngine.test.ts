import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { AdaptivePriorityPolicy } from "@/domain/adaptive/AdaptivePriorityPolicy";
import { ContextSelectionPolicy } from "@/domain/adaptive/ContextSelectionPolicy";
import { ExposurePolicy } from "@/domain/adaptive/ExposurePolicy";
import { ProgressionReadinessPolicy } from "@/domain/adaptive/ProgressionReadinessPolicy";
import { ReviewSessionPlanner } from "@/domain/adaptive/ReviewSessionPlanner";
import { MasteryUpdatePolicy } from "@/domain/learning/MasteryUpdatePolicy";
import { InMemoryReviewSessionRepository } from "@/repositories/memory/InMemoryReviewSessionRepository";
import { KnowledgeMastery } from "@/types/memory";
import { KnowledgeItem } from "@/types/curriculum";
import { ReviewRecommendation, ReviewSession } from "@/types/adaptiveReview";
import { LearningEvidence } from "@/types/learning";

describe("Adaptive Review & Memory Loop Domain Engine (LE-008)", () => {
  const childId = "child_test_le008";
  let reviewSessionRepo: InMemoryReviewSessionRepository;

  const mockKnowledgeItem: KnowledgeItem = {
    id: "k_test_hello",
    type: "vocabulary",
    primaryText: "Hello",
    vietnameseMeaning: "Xin chào",
    targetStage: "recognize",
    skillFocus: ["vocabulary", "speaking"],
    schoolAlignment: {
      grade: 3,
      semester: 1,
      moetStandardCode: "GDPT2018-G3-U1",
      globalSuccessUnit: 1,
      globalSuccessLessonRef: "Unit 1 - Lesson 1",
    },
    communicationCompetency: {
      functionCategory: "Greetings",
      canDoStatementEn: "Can say hello",
      canDoStatementVi: "Biết chào hỏi",
      fluencyExpectation: "word",
      naturalContextExample: "Hello, Linh!",
    },
    learningObjectiveIds: ["lo_g3_u1_1"],
    relations: [
      {
        targetId: "k_test_prereq_sounds",
        relationType: "prerequisite",
      },
    ],
    recallVariants: [
      {
        id: "var_flashcard",
        contextType: "flashcard",
        promptText: "Hello",
        promptTextVi: "Xin chào",
        scenarioDescription: "Thẻ từ vựng",
        expectedResponse: "Hello",
      },
      {
        id: "var_speaking",
        contextType: "speaking_challenge",
        promptText: "Say Hello to Chú Lười",
        promptTextVi: "Nói Hello với Chú Lười",
        scenarioDescription: "Thử thách phát âm",
        expectedResponse: "Hello",
      },
      {
        id: "var_conversation",
        contextType: "conversation",
        promptText: "Chú Lười: Hi! What do you say?",
        promptTextVi: "Chú Lười chào bạn, bạn đáp lại thế nào?",
        scenarioDescription: "Hội thoại",
        expectedResponse: "Hello",
      },
    ],
    tags: ["greeting"],
  };

  beforeEach(() => {
    reviewSessionRepo = new InMemoryReviewSessionRepository();
  });

  it("Test A (Weak Skill Detection): Selects speaking review when recognition=90 but speaking=35", () => {
    const mastery: KnowledgeMastery = {
      id: "m_1",
      studentId: childId,
      knowledgeId: "k_test_hello",
      masteryScore: 65,
      recognitionScore: 90,
      recallScore: 70,
      listeningScore: 80,
      speakingScore: 35, // Weak dimension
      readingScore: 85,
      writingScore: 75,
      dimensions: {
        recognitionMastery: 90,
        listeningMastery: 80,
        speakingMastery: 35,
        readingMastery: 85,
        writingMastery: 75,
        pronunciationMastery: 50,
        applicationMastery: 40,
        schoolCurriculumScore: 85,
        communicationCompetencyScore: 40,
        aggregateMasteryScore: 65,
      },
      lastSeenAt: new Date(Date.now() - 86400000).toISOString(),
      nextReviewAt: new Date().toISOString(),
      reviewCount: 3,
      consecutiveCorrectStreak: 2,
      isWeakness: true,
    };

    const weakest = AdaptivePriorityPolicy.findWeakestSkill(mastery);
    assert.strictEqual(weakest.skill, "speaking");
    assert.strictEqual(weakest.score, 35);

    const prio = AdaptivePriorityPolicy.calculatePriority(mastery, mockKnowledgeItem);
    assert.strictEqual(prio.targetSkill, "speaking");
    assert.strictEqual(prio.reason, "WEAK_SKILL");
  });

  it("Test B (Overdue Item Priority): Overdue item receives higher priority than recently reviewed high mastery item", () => {
    const now = new Date();

    const recentMastery: KnowledgeMastery = {
      id: "m_recent",
      studentId: childId,
      knowledgeId: "k_recent",
      masteryScore: 80,
      recognitionScore: 80,
      recallScore: 80,
      listeningScore: 80,
      speakingScore: 80,
      readingScore: 80,
      writingScore: 80,
      lastSeenAt: now.toISOString(),
      nextReviewAt: new Date(now.getTime() + 5 * 86400000).toISOString(),
      reviewCount: 4,
      consecutiveCorrectStreak: 3,
      isWeakness: false,
    };

    const overdueMastery: KnowledgeMastery = {
      id: "m_overdue",
      studentId: childId,
      knowledgeId: "k_overdue",
      masteryScore: 60,
      recognitionScore: 60,
      recallScore: 60,
      listeningScore: 60,
      speakingScore: 60,
      readingScore: 60,
      writingScore: 60,
      lastSeenAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
      nextReviewAt: new Date(now.getTime() - 4 * 86400000).toISOString(), // 4 days overdue
      reviewCount: 2,
      consecutiveCorrectStreak: 1,
      isWeakness: false,
    };

    const prioRecent = AdaptivePriorityPolicy.calculatePriority(recentMastery, undefined, false, now);
    const prioOverdue = AdaptivePriorityPolicy.calculatePriority(overdueMastery, undefined, false, now);

    assert.ok(prioOverdue.priority > prioRecent.priority);
    assert.strictEqual(prioOverdue.reason, "OVERDUE");
  });

  it("Test C (Context Rotation): Rotates away from last recall context to prevent repetition loops", () => {
    const masteryWithFlashcard: KnowledgeMastery = {
      id: "m_1",
      studentId: childId,
      knowledgeId: mockKnowledgeItem.id,
      masteryScore: 50,
      recognitionScore: 50,
      recallScore: 50,
      listeningScore: 50,
      speakingScore: 40,
      readingScore: 50,
      writingScore: 50,
      lastSeenAt: new Date().toISOString(),
      nextReviewAt: new Date().toISOString(),
      reviewCount: 1,
      consecutiveCorrectStreak: 1,
      isWeakness: false,
      lastRecallContext: "flashcard", // Last context was flashcard
    };

    const selectedVariant = ContextSelectionPolicy.selectVariant(
      mockKnowledgeItem,
      "speaking",
      masteryWithFlashcard
    );

    assert.ok(selectedVariant !== null);
    assert.notStrictEqual(selectedVariant?.contextType, "flashcard");
    assert.ok(
      selectedVariant?.contextType === "speaking_challenge" ||
        selectedVariant?.contextType === "conversation"
    );
  });

  it("Test D (Prerequisite Gap): ProgressionReadinessPolicy blocks advancement if prerequisite is unmastered", () => {
    const allMasteries = new Map<string, KnowledgeMastery>([
      [
        "k_test_prereq_sounds",
        {
          id: "m_prereq",
          studentId: childId,
          knowledgeId: "k_test_prereq_sounds",
          masteryScore: 30, // Unmastered
          recognitionScore: 30,
          recallScore: 30,
          listeningScore: 30,
          speakingScore: 30,
          readingScore: 30,
          writingScore: 30,
          lastSeenAt: new Date().toISOString(),
          nextReviewAt: new Date().toISOString(),
          reviewCount: 1,
          consecutiveCorrectStreak: 0,
          isWeakness: true,
        },
      ],
    ]);

    const allKnowledge = new Map<string, KnowledgeItem>([[mockKnowledgeItem.id, mockKnowledgeItem]]);

    const readiness = ProgressionReadinessPolicy.evaluateReadiness(
      mockKnowledgeItem,
      allMasteries,
      allKnowledge
    );

    assert.strictEqual(readiness.readiness, "REINFORCE_PREREQUISITE");
    assert.deepStrictEqual(readiness.blockingPrerequisiteIds, ["k_test_prereq_sounds"]);
  });

  it("Test E (Interleaved Review Planning): Session contains a balanced mix of overdue, weak, and reinforcement items", () => {
    const candidates: ReviewRecommendation[] = [
      {
        childId,
        knowledgeId: "k_1",
        priority: 95,
        reason: "OVERDUE",
        targetSkill: "vocabulary",
        difficulty: "CURRENT",
        reviewMode: "flashcard",
        dueAt: new Date().toISOString(),
        prerequisiteKnowledgeIds: [],
        explanationVi: "Quá hạn",
      },
      {
        childId,
        knowledgeId: "k_2",
        priority: 90,
        reason: "WEAK_SKILL",
        targetSkill: "speaking",
        difficulty: "EASIER",
        reviewMode: "speaking_challenge",
        dueAt: new Date().toISOString(),
        prerequisiteKnowledgeIds: [],
        explanationVi: "Kỹ năng nói yếu",
      },
      {
        childId,
        knowledgeId: "k_3",
        priority: 85,
        reason: "PREREQUISITE_GAP",
        targetSkill: "listening",
        difficulty: "CURRENT",
        reviewMode: "audio_recognition",
        dueAt: new Date().toISOString(),
        prerequisiteKnowledgeIds: [],
        explanationVi: "Thiếu nền tảng",
      },
      {
        childId,
        knowledgeId: "k_4",
        priority: 80,
        reason: "FORGETTING_RISK",
        targetSkill: "writing",
        difficulty: "CURRENT",
        reviewMode: "writing_task",
        dueAt: new Date().toISOString(),
        prerequisiteKnowledgeIds: [],
        explanationVi: "Nguy cơ quên",
      },
    ];

    const planned = ReviewSessionPlanner.planInterleavedSession(candidates, {
      maxItemsPerSession: 4,
    });

    assert.strictEqual(planned.length, 4);
    const skills = planned.map((p) => p.targetSkill);
    assert.ok(new Set(skills).size >= 3);
  });

  it("Test F (Anti-Overtraining): High stable mastery with recent exposure is suppressed", () => {
    const masterMastery: KnowledgeMastery = {
      id: "m_high",
      studentId: childId,
      knowledgeId: "k_master",
      masteryScore: 92,
      recognitionScore: 95,
      recallScore: 90,
      listeningScore: 92,
      speakingScore: 90,
      readingScore: 90,
      writingScore: 90,
      lastSeenAt: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
      nextReviewAt: new Date(Date.now() + 10 * 86400000).toISOString(),
      reviewCount: 6,
      consecutiveCorrectStreak: 5,
      isWeakness: false,
    };

    const exposure = ExposurePolicy.evaluate(masterMastery);
    assert.strictEqual(exposure.shouldSuppress, true);
    assert.ok(exposure.overexposurePenalty >= 30);
  });

  it("Test G (Transfer Mastery Constraint): Multiple choice victory alone updates recognition, NOT applicationMastery", () => {
    const initialMastery: KnowledgeMastery = {
      id: "m_trans",
      studentId: childId,
      knowledgeId: "k_trans",
      masteryScore: 50,
      recognitionScore: 50,
      recallScore: 50,
      listeningScore: 50,
      speakingScore: 50,
      readingScore: 50,
      writingScore: 50,
      dimensions: {
        recognitionMastery: 50,
        listeningMastery: 50,
        speakingMastery: 50,
        readingMastery: 50,
        writingMastery: 50,
        pronunciationMastery: 50,
        applicationMastery: 50,
        schoolCurriculumScore: 50,
        communicationCompetencyScore: 50,
        aggregateMasteryScore: 50,
      },
      lastSeenAt: new Date().toISOString(),
      nextReviewAt: new Date().toISOString(),
      reviewCount: 1,
      consecutiveCorrectStreak: 1,
      isWeakness: false,
    };

    const mcEvidence: LearningEvidence = {
      childId,
      lessonId: "sess_test",
      activityId: "act_mc",
      knowledgeIds: ["k_trans"],
      skill: "vocabulary",
      attemptNumber: 1,
      correct: true,
      score: 100,
      responseTimeMs: 1500,
      hintsUsed: 0,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const result = MasteryUpdatePolicy.applyEvidence(initialMastery, mcEvidence);

    assert.ok(result.dimensions.recognitionMastery > 50);
    assert.strictEqual(result.dimensions.applicationMastery, 50);
  });

  it("Test H (Stale Write & Concurrency Defense): Rejects older version update on ReviewSession", async () => {
    const now = new Date().toISOString();
    const session: ReviewSession = {
      id: "rev_sess_stale",
      childId,
      items: [],
      currentActivityIndex: 0,
      completedItemIds: [],
      evidences: [],
      totalStarsEarned: 0,
      totalXpEarned: 0,
      totalPetFoodEarned: 0,
      heartsRemaining: 5,
      maxHearts: 5,
      startedAt: now,
      updatedAt: now,
      status: "in_progress",
      version: 2,
    };

    await reviewSessionRepo.createSession(session);

    const staleUpdate: ReviewSession = {
      ...session,
      version: 1,
      totalStarsEarned: 999,
    };

    await assert.rejects(async () => {
      await reviewSessionRepo.saveSession(staleUpdate);
    }, /Xung đột phiên ôn tập/);
  });
});
