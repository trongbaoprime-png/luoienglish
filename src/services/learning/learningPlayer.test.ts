import { describe, it } from "node:test";
import assert from "node:assert";
import { ActivityRegistry } from "@/domain/learning/ActivityRegistry";
import { ProgressController } from "@/domain/learning/ProgressController";
import { MasteryUpdatePolicy } from "@/domain/learning/MasteryUpdatePolicy";
import { lessonG3U1L1 } from "@/domain/curriculum/seedGrade3";
import { LearningEvidence, LessonSessionState } from "@/types/learning";
import { KnowledgeMastery } from "@/types/memory";

describe("Learning Player Interactive Engine & Anti-Cheat Validation (LE-007)", () => {
  const childId = "child_test_alice";
  const lesson = lessonG3U1L1;
  const controller = new ProgressController({ maxHearts: 5 });

  it("ActivityRegistry selects correct renderer and handles unknown types safely", () => {
    const vocabRenderer = ActivityRegistry.getRenderer("vocabulary_card");
    assert.ok(vocabRenderer);

    const speakingRenderer = ActivityRegistry.getRenderer("listen_and_repeat");
    assert.ok(speakingRenderer);

    const unknownRenderer = ActivityRegistry.getRenderer("non_existent_future_type");
    assert.ok(unknownRenderer); // Returns safe fallback
  });

  it("ProgressController creates session and records attempts with heart penalties", () => {
    const session = controller.createSession(childId, lesson.id);
    assert.strictEqual(session.status, "in_progress");
    assert.strictEqual(session.currentActivityIndex, 0);
    assert.strictEqual(session.heartsRemaining, 5);

    // Incorrect attempt -> Heart penalty
    const wrongEvidence: LearningEvidence = {
      childId,
      lessonId: lesson.id,
      activityId: lesson.activities[0]!.id,
      knowledgeIds: lesson.activities[0]!.knowledgeItemIds,
      skill: "speaking",
      attemptNumber: 1,
      correct: false,
      score: 0,
      responseTimeMs: 1500,
      hintsUsed: 1,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const sessionAfterWrong = controller.recordAttempt(session, lesson, wrongEvidence);
    assert.strictEqual(sessionAfterWrong.heartsRemaining, 4);
    assert.strictEqual(sessionAfterWrong.totalStarsEarned, 0);

    // Correct attempt -> Stars awarded
    const correctEvidence: LearningEvidence = {
      ...wrongEvidence,
      correct: true,
      score: 100,
    };

    const sessionAfterCorrect = controller.recordAttempt(sessionAfterWrong, lesson, correctEvidence);
    assert.strictEqual(sessionAfterCorrect.heartsRemaining, 4);
    assert.strictEqual(sessionAfterCorrect.totalStarsEarned, lesson.activities[0]!.rewardPoints.stars);
  });

  it("Anti-Cheat: ProgressController rejects skipping required activities", () => {
    const session = controller.createSession(childId, lesson.id);

    // Attempt to jump to last activity and complete without doing intermediate ones
    assert.strictEqual(controller.canComplete(session, lesson), false);

    // nextActivity should throw when trying to complete uncompleted session
    const fakeSkippedSession: LessonSessionState = {
      ...session,
      currentActivityIndex: lesson.activities.length - 1,
      completedActivityIds: [lesson.activities[0]!.id], // Only 1 completed out of 3
    };

    assert.throws(() => {
      controller.nextActivity(fakeSkippedSession, lesson);
    }, /Chưa hoàn thành tất cả hoạt động/);
  });

  it("Stale Session Protection: Rejects older or equal versions on merge", () => {
    const sessionV2: LessonSessionState = {
      ...controller.createSession(childId, lesson.id),
      version: 2,
    };

    const staleIncomingV1: LessonSessionState = {
      ...sessionV2,
      version: 1,
      totalStarsEarned: 999, // Malicious stale write
    };

    const merged = controller.mergeSession(sessionV2, staleIncomingV1);
    assert.strictEqual(merged.version, 2);
    assert.strictEqual(merged.totalStarsEarned, 0); // Stale write rejected
  });

  it("Cross-Child Session Isolation: Rejects merging different childId", () => {
    const aliceSession = controller.createSession("child_alice", lesson.id);
    const bobSession = controller.createSession("child_bob", lesson.id);

    assert.throws(() => {
      controller.mergeSession(aliceSession, bobSession);
    }, /Vi phạm phiên/);
  });

  it("MasteryUpdatePolicy accurately maps evidence to MultidimensionalMastery dimensions", () => {
    const initialMastery: KnowledgeMastery = {
      id: "m_test_1",
      studentId: childId,
      knowledgeId: "k_g3_u1_hello",
      masteryScore: 50,
      recognitionScore: 50,
      recallScore: 50,
      listeningScore: 50,
      speakingScore: 50,
      readingScore: 50,
      writingScore: 50,
      lastSeenAt: new Date().toISOString(),
      nextReviewAt: new Date().toISOString(),
      reviewCount: 1,
      consecutiveCorrectStreak: 1,
      isWeakness: false,
    };

    const speakingEvidence: LearningEvidence = {
      childId,
      lessonId: lesson.id,
      activityId: lesson.activities[0]!.id,
      knowledgeIds: ["k_g3_u1_hello"],
      skill: "speaking",
      attemptNumber: 1,
      correct: true,
      score: 95,
      responseTimeMs: 1200,
      hintsUsed: 0,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const result = MasteryUpdatePolicy.applyEvidence(initialMastery, speakingEvidence);
    assert.ok(result.updatedScore > initialMastery.masteryScore);
    assert.ok(result.dimensions.speakingMastery > 50);
    assert.strictEqual(result.isWeakness, false);
  });
});
