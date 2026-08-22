import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import { RewardService } from "./RewardService";
import { DailyGoalService } from "./DailyGoalService";
import { AchievementService } from "./AchievementService";
import { MotivationProjectionProcessor } from "./MotivationProjectionProcessor";
import { InMemoryRewardRepository } from "@/repositories/memory/InMemoryRewardRepository";
import { InMemoryAchievementRepository } from "@/repositories/memory/InMemoryAchievementRepository";
import { InMemoryDailyGoalRepository } from "@/repositories/memory/InMemoryDailyGoalRepository";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";

describe("Atomic & Idempotent Motivation Projection Application (LE-009C)", () => {
  let rewardRepo: InMemoryRewardRepository;
  let achievementRepo: InMemoryAchievementRepository;
  let goalRepo: InMemoryDailyGoalRepository;

  const childId = "child_test_outbox_1";
  const childId2 = "child_test_outbox_2";

  beforeEach(() => {
    rewardRepo = new InMemoryRewardRepository();
    achievementRepo = new InMemoryAchievementRepository();
    goalRepo = new InMemoryDailyGoalRepository();

    (RepositoryFactory as unknown as { getRewardRepository: () => typeof rewardRepo }).getRewardRepository =
      () => rewardRepo;
    (RepositoryFactory as unknown as { getAchievementRepository: () => typeof achievementRepo }).getAchievementRepository =
      () => achievementRepo;
    (RepositoryFactory as unknown as { getDailyGoalRepository: () => typeof goalRepo }).getDailyGoalRepository =
      () => goalRepo;
  });

  it("Test 1: Two concurrent DailyGoal projections on same projectionKey -> +1 count exactly", async () => {
    const key = "proj_goal_concurrent_1";

    const [r1, r2] = await Promise.all([
      DailyGoalService.applyGoalProjection({
        childId,
        goalType: "LEARN_NEW_VOCABULARY",
        projectionKey: key,
        delta: 1,
      }),
      DailyGoalService.applyGoalProjection({
        childId,
        goalType: "LEARN_NEW_VOCABULARY",
        projectionKey: key,
        delta: 1,
      }),
    ]);

    // Exactly one was applied, the other was identified as already processed
    const appliedList = [r1.applied, r2.applied].filter(Boolean);
    assert.strictEqual(appliedList.length, 1);

    const goals = await DailyGoalService.getOrInitTodayGoals(childId);
    const vocabGoal = goals.goals.find((g) => g.type === "LEARN_NEW_VOCABULARY");
    assert.strictEqual(vocabGoal?.currentCount, 1);
  });

  it("Test 2: Two concurrent Achievement projections on same projectionKey -> +1 count exactly", async () => {
    const key = "proj_ach_concurrent_1";

    const [r1, r2] = await Promise.all([
      AchievementService.applyAchievementProjection({
        childId,
        achievementId: "ach_speaking_10",
        projectionKey: key,
        delta: 1,
      }),
      AchievementService.applyAchievementProjection({
        childId,
        achievementId: "ach_speaking_10",
        projectionKey: key,
        delta: 1,
      }),
    ]);

    const appliedList = [r1.applied, r2.applied].filter(Boolean);
    assert.strictEqual(appliedList.length, 1);

    const ach = await achievementRepo.getAchievement(childId, "ach_speaking_10");
    assert.strictEqual(ach?.currentCount, 1);
  });

  it("Test 3: Concurrent achievement threshold crossing -> exactly one authoritative unlock", async () => {
    // Bring speaking achievement to count 9 (target is 10)
    for (let i = 0; i < 9; i++) {
      await AchievementService.applyAchievementProjection({
        childId,
        achievementId: "ach_speaking_10",
        projectionKey: `prep_key_${i}`,
        delta: 1,
      });
    }

    // 2 concurrent calls both trying to push over threshold with different keys
    const [u1, u2] = await Promise.all([
      AchievementService.applyAchievementProjection({
        childId,
        achievementId: "ach_speaking_10",
        projectionKey: "proj_unlock_race_1",
        delta: 1,
      }),
      AchievementService.applyAchievementProjection({
        childId,
        achievementId: "ach_speaking_10",
        projectionKey: "proj_unlock_race_2",
        delta: 1,
      }),
    ]);

    const unlocks = [u1.unlocked, u2.unlocked].filter(Boolean);
    assert.strictEqual(unlocks.length, 1);

    const ach = await achievementRepo.getAchievement(childId, "ach_speaking_10");
    assert.strictEqual(ach?.isUnlocked, true);
  });

  it("Test 4: Failure before projection transaction commit -> aggregate unchanged, marker absent", async () => {
    goalRepo.failureHook = (stage) => {
      if (stage === "BEFORE_PROJECTION_COMMIT") {
        throw new Error("Simulated Datastore Failure Before Goal Commit");
      }
    };

    await assert.rejects(
      async () => {
        await DailyGoalService.applyGoalProjection({
          childId,
          goalType: "LEARN_NEW_VOCABULARY",
          projectionKey: "proj_fail_key_1",
          delta: 1,
        });
      },
      /Simulated Datastore Failure/
    );

    goalRepo.failureHook = undefined;

    // Marker is absent and count is 0
    const markerExists = await goalRepo.isProjectionProcessed(childId, "proj_fail_key_1");
    assert.strictEqual(markerExists, false);

    const goals = await DailyGoalService.getOrInitTodayGoals(childId);
    const vocabGoal = goals.goals.find((g) => g.type === "LEARN_NEW_VOCABULARY");
    assert.strictEqual(vocabGoal?.currentCount, 0);
  });

  it("Test 5: Two concurrent MotivationProjectionProcessors on same MotivationEvent -> all effects effectively once", async () => {
    const res = await RewardService.awardEvent({
      childId: childId2,
      idempotencyKey: "tx_event_concurrent_procs",
      context: { event: "speaking_completed", skill: "speaking" },
    });

    const [p1, p2] = await Promise.all([
      MotivationProjectionProcessor.processEventProjections(res.motivationEvent),
      MotivationProjectionProcessor.processEventProjections(res.motivationEvent),
    ]);

    assert.strictEqual(p1.event.processingState, "PROCESSED");
    assert.strictEqual(p2.event.processingState, "PROCESSED");

    const goals = await DailyGoalService.getOrInitTodayGoals(childId2);
    const speakGoal = goals.goals.find((g) => g.type === "SPEAK_PRACTICE");
    assert.strictEqual(speakGoal?.currentCount, 1);

    const ach = await achievementRepo.getAchievement(childId2, "ach_speaking_10");
    assert.strictEqual(ach?.currentCount, 1);
  });

  it("Test 6: Simulated crash before projection -> recovery completes projections idempotently", async () => {
    const idempotencyKey = "tx_crash_recovery_009c";

    // Manually commit transaction without running projections
    const txRes = await rewardRepo.recordTransaction({
      id: "tx_999",
      childId,
      idempotencyKey,
      triggerEvent: "lesson_completed",
      starsDelta: 3,
      xpDelta: 60,
      coinsDelta: 20,
      petFoodDelta: 3,
      createdAt: new Date().toISOString(),
    }, {
      skill: "vocabulary",
    });

    assert.strictEqual(txRes.motivationEvent.processingState, "PENDING");

    // Recover pending events
    const recovered = await MotivationProjectionProcessor.recoverPendingEvents(childId);
    assert.strictEqual(recovered, 1);

    const eventAfter = await rewardRepo.getMotivationEvent(idempotencyKey);
    assert.strictEqual(eventAfter?.processingState, "PROCESSED");

    const goals = await DailyGoalService.getOrInitTodayGoals(childId);
    const vocabGoal = goals.goals.find((g) => g.type === "LEARN_NEW_VOCABULARY");
    assert.strictEqual(vocabGoal?.currentCount, 1);
  });

  it("Test 7: Supportive Streak logic -> same-day study does not increment, next-day increments once", async () => {
    await RewardService.awardEvent({
      childId,
      idempotencyKey: "tx_streak_test_1",
      context: { event: "lesson_completed" },
    });

    const bal1 = await RewardService.getChildBalance(childId);
    assert.strictEqual(bal1.currentStreakDays, 1);

    // Same day call
    await RewardService.awardEvent({
      childId,
      idempotencyKey: "tx_streak_test_2",
      context: { event: "lesson_completed" },
    });
    const bal2 = await RewardService.getChildBalance(childId);
    assert.strictEqual(bal2.currentStreakDays, 1);

    // Simulate next day
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const initialBal = await rewardRepo.getBalance(childId);
    initialBal.lastStudyDate = yesterday;
    initialBal.currentStreakDays = 2;
    initialBal.longestStreakDays = 2;
    rewardRepo.setBalanceForTest(initialBal);

    await RewardService.awardEvent({
      childId,
      idempotencyKey: "tx_streak_next_day_test",
      context: { event: "lesson_completed" },
    });

    const bal3 = await RewardService.getChildBalance(childId);
    assert.strictEqual(bal3.currentStreakDays, 3);
  });
});
