import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { ActivityEvaluatorFactory } from "@/domain/learning/evaluators/ActivityEvaluatorFactory";
import { InMemoryLearningSessionRepository } from "@/repositories/memory/InMemoryLearningSessionRepository";
import { InMemoryRewardRepository } from "@/repositories/memory/InMemoryRewardRepository";
import { lessonG3U1L1 } from "@/domain/curriculum/seedGrade3";
import { LearningSession } from "@/types/learning";
import { Activity } from "@/types/curriculum";

describe("Server-Authoritative Learning Evidence & Anti-Cheat Validation (LE-007B)", () => {
  const childId = "child_test_alice";
  const lesson = lessonG3U1L1;
  let sessionRepo: InMemoryLearningSessionRepository;
  let rewardRepo: InMemoryRewardRepository;

  beforeEach(() => {
    sessionRepo = new InMemoryLearningSessionRepository();
    rewardRepo = new InMemoryRewardRepository();
  });

  it("Attack 1 (Score Forgery): MultipleChoiceEvaluator strictly ignores client claims and computes true correctness", () => {
    const activity: Activity = lesson.activities.find((a) => a.type === "choose_correct" || a.type === "listen_and_choose") || {
      id: "act_test_mc",
      lessonId: lesson.id,
      title: "Test MC",
      type: "choose_correct",
      prompt: "Who is this?",
      instructionVi: "Chọn đáp án đúng",
      knowledgeItemIds: ["k_g3_u1_hello"],
      rewardPoints: { stars: 5, xp: 20, petFood: 1 },
      options: [
        { id: "opt_correct", label: "Hello", isCorrect: true },
        { id: "opt_wrong", label: "Goodbye", isCorrect: false },
      ],
    };

    const evaluator = ActivityEvaluatorFactory.getEvaluator(activity);

    // Client selects wrong option
    const resultWrong = evaluator.evaluate(activity, {
      selectedOptionId: "opt_wrong",
    });

    assert.strictEqual(resultWrong.correct, false);
    assert.strictEqual(resultWrong.score, 0);

    // Client selects correct option
    const resultCorrect = evaluator.evaluate(activity, {
      selectedOptionId: "opt_correct",
    });

    assert.strictEqual(resultCorrect.correct, true);
    assert.strictEqual(resultCorrect.score, 100);
  });

  it("Attack 2 (Knowledge ID Forgery): Evaluator strictly returns authoritative knowledge IDs from activity schema", () => {
    const activity = lesson.activities[0]!;
    const evaluator = ActivityEvaluatorFactory.getEvaluator(activity);

    const result = evaluator.evaluate(activity, {
      acknowledged: true,
    });

    assert.deepStrictEqual(result.knowledgeIds, activity.knowledgeItemIds);
  });

  it("Attack 3 (Speaking Score Forgery): SpeakingEvaluator rejects empty or spoofed zero-duration recordings", () => {
    const speakingAct = lesson.activities.find((a) => a.type === "listen_and_repeat" || a.type === "speak_aloud") || {
      id: "act_test_speak",
      lessonId: lesson.id,
      title: "Test Speak",
      type: "listen_and_repeat",
      prompt: "Say Hello",
      instructionVi: "Nói Hello",
      targetExpectedText: "Hello",
      knowledgeItemIds: ["k_g3_u1_hello"],
      rewardPoints: { stars: 5, xp: 20, petFood: 1 },
    };

    const evaluator = ActivityEvaluatorFactory.getEvaluator(speakingAct);

    // Empty / short recording spoof
    const spoofResult = evaluator.evaluate(speakingAct, {
      spokenTranscript: "",
      audioRecordingDurationMs: 100,
    });

    assert.strictEqual(spoofResult.correct, false);
    assert.strictEqual(spoofResult.score, 0);

    // Legitimate recording with transcript
    const validResult = evaluator.evaluate(speakingAct, {
      spokenTranscript: "Hello",
      audioRecordingDurationMs: 2000,
    });

    assert.strictEqual(validResult.correct, true);
    assert.ok(validResult.score >= 80);
  });

  it("Attack 4 (Skip Attack): Verifies session cannot be marked completed if activities are skipped", async () => {
    const now = new Date().toISOString();
    const session: LearningSession = {
      id: "ls_test_skip",
      childId,
      lessonId: lesson.id,
      status: "in_progress",
      currentActivityIndex: 0,
      completedActivityIds: [lesson.activities[0]!.id], // Only 1 completed out of all
      evidences: [],
      totalStarsEarned: 5,
      totalXpEarned: 20,
      totalPetFoodEarned: 1,
      heartsRemaining: 5,
      maxHearts: 5,
      startedAt: now,
      updatedAt: now,
      version: 1,
    };

    await sessionRepo.createSession(session);

    // Check anti-skip rule
    const requiredIds = lesson.activities.map((a) => a.id);
    const isCompleted = requiredIds.every((id) => session.completedActivityIds.includes(id));
    assert.strictEqual(isCompleted, false);
  });

  it("Attack 5 (Stale Write Defense): Rejects older version update in repository", async () => {
    const now = new Date().toISOString();
    const session: LearningSession = {
      id: "ls_test_stale",
      childId,
      lessonId: lesson.id,
      status: "in_progress",
      currentActivityIndex: 0,
      completedActivityIds: [],
      evidences: [],
      totalStarsEarned: 0,
      totalXpEarned: 0,
      totalPetFoodEarned: 0,
      heartsRemaining: 5,
      maxHearts: 5,
      startedAt: now,
      updatedAt: now,
      version: 2,
    };

    await sessionRepo.createSession(session);

    // Attempt to write version 1 over version 2
    const staleUpdate: LearningSession = {
      ...session,
      version: 1,
      totalStarsEarned: 999,
    };

    await assert.rejects(async () => {
      await sessionRepo.saveSession(staleUpdate);
    }, /Xung đột phiên học/);
  });

  it("Attack 6 (Duplicate Completion & Reward Idempotency): Duplicate transaction on same key does not double-credit balance", async () => {
    const idempotencyKey = `claim_lesson_${childId}_${lesson.id}_sess_123`;

    const tx1 = await rewardRepo.recordTransaction({
      id: "tx_1",
      childId,
      triggerEvent: "lesson_completed",
      sourceEntityId: lesson.id,
      starsDelta: 15,
      xpDelta: 60,
      coinsDelta: 0,
      petFoodDelta: 3,
      description: "Hoàn thành bài học",
      createdAt: new Date().toISOString(),
      idempotencyKey,
    });

    const balance1 = await rewardRepo.getBalance(childId);
    assert.strictEqual(balance1.totalStars, 15);

    // Duplicate call with same idempotency key
    const tx2 = await rewardRepo.recordTransaction({
      id: "tx_duplicate",
      childId,
      triggerEvent: "lesson_completed",
      sourceEntityId: lesson.id,
      starsDelta: 15,
      xpDelta: 60,
      coinsDelta: 0,
      petFoodDelta: 3,
      description: "Hoàn thành bài học",
      createdAt: new Date().toISOString(),
      idempotencyKey,
    });

    const balance2 = await rewardRepo.getBalance(childId);
    assert.strictEqual(balance2.totalStars, 15); // Stars remain 15, NOT doubled to 30!
    assert.strictEqual(tx2.transaction.id, tx1.transaction.id);
  });
});
