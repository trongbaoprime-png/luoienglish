import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { AdaptivePriorityPolicy } from "@/domain/adaptive/AdaptivePriorityPolicy";
import { ContextSelectionPolicy } from "@/domain/adaptive/ContextSelectionPolicy";
import { ExposurePolicy } from "@/domain/adaptive/ExposurePolicy";
import { ProgressionReadinessPolicy } from "@/domain/adaptive/ProgressionReadinessPolicy";
import { ReviewSessionPlanner } from "@/domain/adaptive/ReviewSessionPlanner";
import { MasteryUpdatePolicy } from "@/domain/learning/MasteryUpdatePolicy";
import { ReviewAttemptTransactionService } from "./ReviewAttemptTransactionService";
import { InMemoryReviewSessionRepository } from "@/repositories/memory/InMemoryReviewSessionRepository";
import { InMemoryMemoryRepository } from "@/repositories/memory/InMemoryMemoryRepository";
import { InMemoryChildRepository } from "@/repositories/memory/InMemoryChildRepository";
import { InMemoryRewardRepository } from "@/repositories/memory/InMemoryRewardRepository";
import { InMemoryReviewAttemptTransactionRepository } from "@/repositories/memory/InMemoryReviewAttemptTransactionRepository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { KnowledgeMastery } from "@/types/memory";
import { KnowledgeItem, Activity } from "@/types/curriculum";
import { ReviewRecommendation, ReviewSession, ReviewSessionItem } from "@/types/adaptiveReview";
import { LearningEvidence } from "@/types/learning";
import { ServerAuthError } from "@/services/auth/serverAuth";

describe("Adaptive Review & Memory Loop Domain Engine (LE-008, LE-008B & LE-008C)", () => {
  const parentUid = "parent_test_1";
  const childId = "child_test_le008";
  let reviewSessionRepo: InMemoryReviewSessionRepository;
  let memoryRepo: InMemoryMemoryRepository;
  let childRepo: InMemoryChildRepository;
  let rewardRepo: InMemoryRewardRepository;
  let transactionRepo: InMemoryReviewAttemptTransactionRepository;

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

  beforeEach(async () => {
    reviewSessionRepo = new InMemoryReviewSessionRepository();
    memoryRepo = new InMemoryMemoryRepository();
    childRepo = new InMemoryChildRepository();
    rewardRepo = new InMemoryRewardRepository();
    transactionRepo = new InMemoryReviewAttemptTransactionRepository(
      reviewSessionRepo,
      memoryRepo
    );

    // Inject repositories into RepositoryFactory
    (RepositoryFactory as unknown as { getReviewSessionRepository: () => typeof reviewSessionRepo }).getReviewSessionRepository =
      () => reviewSessionRepo;
    (RepositoryFactory as unknown as { getMemoryRepository: () => typeof memoryRepo }).getMemoryRepository =
      () => memoryRepo;
    (RepositoryFactory as unknown as { getChildRepository: () => typeof childRepo }).getChildRepository =
      () => childRepo;
    (RepositoryFactory as unknown as { getRewardRepository: () => typeof rewardRepo }).getRewardRepository =
      () => rewardRepo;
    (RepositoryFactory as unknown as { getReviewAttemptTransactionRepository: () => typeof transactionRepo }).getReviewAttemptTransactionRepository =
      () => transactionRepo;

    // Seed child profile
    await childRepo.create({
      id: childId,
      parentUid,
      nickname: "Alice",
      displayName: "Alice",
      avatarKey: "avatar_sloth_1",
      schoolGrade: 3,
      englishLevel: "A1",
      interests: ["animals"],
      preferences: { themeId: "cozy" },
      dailyGoalMinutes: 15,
      totalStudyTimeMinutes: 0,
      streakDays: 0,
      lastActiveDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
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
      speakingScore: 35,
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
      nextReviewAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
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
      lastRecallContext: "flashcard",
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
          masteryScore: 30,
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

    const readiness = ProgressionReadinessPolicy.evaluateReadiness(
      mockKnowledgeItem,
      allMasteries
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
      lastSeenAt: new Date(Date.now() - 2 * 3600000).toISOString(),
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

  // ==========================================
  // LE-008C TRUE ATOMIC TRANSACTION ATTACK TESTS
  // ==========================================

  it("LE-008C Attack 1 (Failure Injection Test): Datastore crash before commit leaves ZERO partial mutations", async () => {
    const now = new Date().toISOString();
    const activity: Activity = {
      id: "act_test_crash",
      type: "choose_correct",
      prompt: "What is hello?",
      instructionVi: "Chọn đáp án đúng",
      knowledgeItemIds: ["k_test_hello"],
      rewardPoints: { stars: 5, xp: 20, petFood: 1 },
      options: [{ id: "opt_correct", label: "Xin chào", isCorrect: true }],
    };

    const session: ReviewSession = {
      id: "sess_crash_test",
      childId,
      items: [
        {
          id: "item_crash",
          knowledgeId: "k_test_hello",
          activity,
          recommendation: {
            childId,
            knowledgeId: "k_test_hello",
            priority: 80,
            reason: "WEAK_SKILL",
            targetSkill: "vocabulary",
            difficulty: "CURRENT",
            reviewMode: "flashcard",
            dueAt: now,
            prerequisiteKnowledgeIds: [],
            explanationVi: "Ôn từ vựng",
          },
          completed: false,
        },
      ],
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
      version: 1,
    };

    await reviewSessionRepo.createSession(session);

    const initialMastery: KnowledgeMastery = {
      id: `m_${childId}_k_test_hello`,
      studentId: childId,
      knowledgeId: "k_test_hello",
      masteryScore: 50,
      recognitionScore: 50,
      recallScore: 50,
      listeningScore: 50,
      speakingScore: 50,
      readingScore: 50,
      writingScore: 50,
      lastSeenAt: now,
      nextReviewAt: now,
      reviewCount: 0,
      consecutiveCorrectStreak: 0,
      isWeakness: true,
    };
    await memoryRepo.saveMastery(initialMastery);

    // Turn ON simulated crash before transaction commit
    transactionRepo.setSimulatePreCommitFailure(true);

    await assert.rejects(async () => {
      await ReviewAttemptTransactionService.executeAttempt({
        parentUid,
        sessionId: "sess_crash_test",
        activityId: "act_test_crash",
        rawResponse: { selectedOptionId: "opt_correct" },
        expectedVersion: 1,
      });
    }, /SIMULATED_DATASTORE_TRANSACTION_FAILURE/);

    // Verify ReviewSession is 100% UNCHANGED (All-or-Nothing)
    const sessionAfterCrash = await reviewSessionRepo.getSession("sess_crash_test");
    assert.strictEqual(sessionAfterCrash?.version, 1);
    assert.strictEqual(sessionAfterCrash?.evidences.length, 0);
    assert.strictEqual(sessionAfterCrash?.completedItemIds.length, 0);
    assert.strictEqual(sessionAfterCrash?.items[0]!.completed, false);

    // Verify KnowledgeMastery is 100% UNCHANGED
    const masteryAfterCrash = await memoryRepo.getMastery(childId, "k_test_hello");
    assert.strictEqual(masteryAfterCrash?.masteryScore, 50);
    assert.strictEqual(masteryAfterCrash?.reviewCount, 0);

    // Turn OFF crash simulation for subsequent tests
    transactionRepo.setSimulatePreCommitFailure(false);
  });

  it("LE-008C Attack 2 (Two Tabs Concurrency Collision): Tab A succeeds, Tab B receives 409 with ZERO mastery mutation", async () => {
    const now = new Date().toISOString();
    const activity: Activity = {
      id: "act_test_1",
      type: "choose_correct",
      prompt: "What is hello?",
      instructionVi: "Chọn đáp án đúng",
      knowledgeItemIds: ["k_test_hello"],
      rewardPoints: { stars: 5, xp: 20, petFood: 1 },
      options: [
        { id: "opt_correct", label: "Xin chào", isCorrect: true },
        { id: "opt_wrong", label: "Tạm biệt", isCorrect: false },
      ],
    };

    const item: ReviewSessionItem = {
      id: "item_1",
      knowledgeId: "k_test_hello",
      activity,
      recommendation: {
        childId,
        knowledgeId: "k_test_hello",
        priority: 80,
        reason: "WEAK_SKILL",
        targetSkill: "vocabulary",
        difficulty: "CURRENT",
        reviewMode: "flashcard",
        dueAt: now,
        prerequisiteKnowledgeIds: [],
        explanationVi: "Ôn từ vựng",
      },
      completed: false,
    };

    const session: ReviewSession = {
      id: "sess_concurrent",
      childId,
      items: [item],
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
      version: 1, // Base version
    };

    await reviewSessionRepo.createSession(session);

    // Initial mastery = 50
    const initialMastery: KnowledgeMastery = {
      id: `m_${childId}_k_test_hello`,
      studentId: childId,
      knowledgeId: "k_test_hello",
      masteryScore: 50,
      recognitionScore: 50,
      recallScore: 50,
      listeningScore: 50,
      speakingScore: 50,
      readingScore: 50,
      writingScore: 50,
      lastSeenAt: now,
      nextReviewAt: now,
      reviewCount: 0,
      consecutiveCorrectStreak: 0,
      isWeakness: true,
    };
    await memoryRepo.saveMastery(initialMastery);

    // Tab A submits with expectedVersion = 1
    const resultA = await ReviewAttemptTransactionService.executeAttempt({
      parentUid,
      sessionId: "sess_concurrent",
      activityId: "act_test_1",
      rawResponse: { selectedOptionId: "opt_correct" },
      expectedVersion: 1,
    });

    assert.strictEqual(resultA.evaluation.correct, true);
    assert.strictEqual(resultA.session.version, 2);

    const masteryAfterA = await memoryRepo.getMastery(childId, "k_test_hello");
    const scoreAfterA = masteryAfterA?.masteryScore;
    assert.ok(scoreAfterA !== undefined && scoreAfterA > 50);

    // Tab B submits with stale expectedVersion = 1
    await assert.rejects(async () => {
      await ReviewAttemptTransactionService.executeAttempt({
        parentUid,
        sessionId: "sess_concurrent",
        activityId: "act_test_1",
        rawResponse: { selectedOptionId: "opt_correct" },
        expectedVersion: 1, // Stale!
      });
    }, (err: Error) => {
      return err instanceof ServerAuthError && err.statusCode === 409;
    });

    // Verify Tab B produced ZERO side-effects on mastery
    const masteryAfterB = await memoryRepo.getMastery(childId, "k_test_hello");
    assert.strictEqual(masteryAfterB?.masteryScore, scoreAfterA); // Strictly unchanged!
  });

  it("LE-008C Attack 3 (Idempotent Attempt Replay): Duplicate attempt returns cached result with no extra mastery mutation", async () => {
    const now = new Date().toISOString();

    const activity: Activity = {
      id: "act_test_replay",
      type: "choose_correct",
      prompt: "What is hello?",
      instructionVi: "Chọn đáp án đúng",
      knowledgeItemIds: ["k_test_hello"],
      rewardPoints: { stars: 5, xp: 20, petFood: 1 },
      options: [{ id: "opt_correct", label: "Xin chào", isCorrect: true }],
    };

    const session: ReviewSession = {
      id: "sess_replay",
      childId,
      items: [
        {
          id: "item_replay",
          knowledgeId: "k_test_hello",
          activity,
          recommendation: {
            childId,
            knowledgeId: "k_test_hello",
            priority: 80,
            reason: "WEAK_SKILL",
            targetSkill: "vocabulary",
            difficulty: "CURRENT",
            reviewMode: "flashcard",
            dueAt: now,
            prerequisiteKnowledgeIds: [],
            explanationVi: "Ôn từ vựng",
          },
          completed: false,
        },
      ],
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
      version: 1,
    };

    await reviewSessionRepo.createSession(session);

    // Initial attempt with attemptId
    const attemptKey = "custom_attempt_req_123";
    const res1 = await ReviewAttemptTransactionService.executeAttempt({
      parentUid,
      sessionId: "sess_replay",
      activityId: "act_test_replay",
      rawResponse: { selectedOptionId: "opt_correct" },
      expectedVersion: 1,
      attemptId: attemptKey,
    });

    assert.strictEqual(res1.isIdempotentReplay, false);
    assert.strictEqual(res1.session.evidences.length, 1);
    const initialMasteryScore = (await memoryRepo.getMastery(childId, "k_test_hello"))?.masteryScore;

    // Duplicate replay with identical attemptId
    const res2 = await ReviewAttemptTransactionService.executeAttempt({
      parentUid,
      sessionId: "sess_replay",
      activityId: "act_test_replay",
      rawResponse: { selectedOptionId: "opt_correct" },
      expectedVersion: 2,
      attemptId: attemptKey,
    });

    assert.strictEqual(res2.isIdempotentReplay, true);
    assert.strictEqual(res2.session.evidences.length, 1); // No extra evidence!
    const afterReplayScore = (await memoryRepo.getMastery(childId, "k_test_hello"))?.masteryScore;
    assert.strictEqual(afterReplayScore, initialMasteryScore); // Zero double mastery credit!
  });

  it("LE-008C Attack 4 (Completed Item Bug Fix): Incorrect attempt decrements hearts and does NOT mark item completed", async () => {
    const now = new Date().toISOString();

    const activity: Activity = {
      id: "act_test_fail",
      type: "choose_correct",
      prompt: "What is hello?",
      instructionVi: "Chọn đáp án đúng",
      knowledgeItemIds: ["k_test_hello"],
      rewardPoints: { stars: 5, xp: 20, petFood: 1 },
      options: [
        { id: "opt_correct", label: "Xin chào", isCorrect: true },
        { id: "opt_wrong", label: "Tạm biệt", isCorrect: false },
      ],
    };

    const session: ReviewSession = {
      id: "sess_fail_test",
      childId,
      items: [
        {
          id: "item_fail",
          knowledgeId: "k_test_hello",
          activity,
          recommendation: {
            childId,
            knowledgeId: "k_test_hello",
            priority: 80,
            reason: "WEAK_SKILL",
            targetSkill: "vocabulary",
            difficulty: "CURRENT",
            reviewMode: "flashcard",
            dueAt: now,
            prerequisiteKnowledgeIds: [],
            explanationVi: "Ôn từ vựng",
          },
          completed: false,
        },
      ],
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
      version: 1,
    };

    await reviewSessionRepo.createSession(session);

    // Send incorrect answer
    const result = await ReviewAttemptTransactionService.executeAttempt({
      parentUid,
      sessionId: "sess_fail_test",
      activityId: "act_test_fail",
      rawResponse: { selectedOptionId: "opt_wrong" },
      expectedVersion: 1,
    });

    assert.strictEqual(result.evaluation.correct, false);
    assert.strictEqual(result.session.heartsRemaining, 4); // Hearts decremented
    assert.strictEqual(result.session.items[0]!.completed, false); // NOT completed!
    assert.strictEqual(result.session.completedItemIds.length, 0); // NOT in completed IDs!
    assert.strictEqual(result.session.currentActivityIndex, 0); // Stays on current activity to retry
  });

  it("LE-008C Attack 5 (Telemetry Sanitization): Maliciously huge response time and hints are clamped safely", async () => {
    const now = new Date().toISOString();

    const activity: Activity = {
      id: "act_test_telemetry",
      type: "choose_correct",
      prompt: "What is hello?",
      instructionVi: "Chọn đáp án đúng",
      knowledgeItemIds: ["k_test_hello"],
      rewardPoints: { stars: 5, xp: 20, petFood: 1 },
      options: [{ id: "opt_correct", label: "Xin chào", isCorrect: true }],
    };

    const session: ReviewSession = {
      id: "sess_telemetry",
      childId,
      items: [
        {
          id: "item_tel",
          knowledgeId: "k_test_hello",
          activity,
          recommendation: {
            childId,
            knowledgeId: "k_test_hello",
            priority: 80,
            reason: "WEAK_SKILL",
            targetSkill: "vocabulary",
            difficulty: "CURRENT",
            reviewMode: "flashcard",
            dueAt: now,
            prerequisiteKnowledgeIds: [],
            explanationVi: "Ôn từ vựng",
          },
          completed: false,
        },
      ],
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
      version: 1,
    };

    await reviewSessionRepo.createSession(session);

    // Send forged 999999ms latency and 999 hints
    const result = await ReviewAttemptTransactionService.executeAttempt({
      parentUid,
      sessionId: "sess_telemetry",
      activityId: "act_test_telemetry",
      rawResponse: { selectedOptionId: "opt_correct" },
      expectedVersion: 1,
      responseTimeMs: 999999,
      hintsUsed: 999,
    });

    const recordedEvidence = result.session.evidences[0]!;
    assert.strictEqual(recordedEvidence.responseTimeMs, 30000); // Clamped to max 30s
    assert.strictEqual(recordedEvidence.hintsUsed, 10); // Clamped to max 10
  });
});
