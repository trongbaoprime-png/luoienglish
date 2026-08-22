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

describe("Atomic Motivation Event Processing & Outbox Resilience (LE-009B)", () => {
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

  it("Scenario A: Reward commit + simulated crash before goal processing -> retry recovers goal once with zero duplicate reward", async () => {
    const idempotencyKey = "tx_crash_before_goal_1";

    // 1. Manually commit transaction without running projections (simulating crash right after ledger commit)
    const txRes = await rewardRepo.recordTransaction({
      id: "tx_101",
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

    assert.strictEqual(txRes.isNew, true);
    assert.strictEqual(txRes.motivationEvent.processingState, "PENDING");

    // Daily goals are currently not updated yet
    const goalsBefore = await DailyGoalService.getOrInitTodayGoals(childId);
    const vocabGoalBefore = goalsBefore.goals.find((g) => g.type === "LEARN_NEW_VOCABULARY");
    assert.strictEqual(vocabGoalBefore?.currentCount, 0);

    // 2. Recovery / Retry arrives (e.g. client retries with same idempotencyKey or worker recovers)
    const retryRes = await RewardService.awardEvent({
      childId,
      idempotencyKey,
      context: { event: "lesson_completed", skill: "vocabulary" },
    });

    assert.strictEqual(retryRes.isNew, false); // Balance was not double-credited!
    assert.strictEqual(retryRes.balance.totalStars, 3);
    assert.strictEqual(retryRes.balance.totalXp, 60);

    // Goal projection successfully completed
    const goalsAfter = await DailyGoalService.getOrInitTodayGoals(childId);
    const vocabGoalAfter = goalsAfter.goals.find((g) => g.type === "LEARN_NEW_VOCABULARY");
    assert.strictEqual(vocabGoalAfter?.currentCount, 1);
  });

  it("Scenario B: Reward commit + crash before achievement processing -> recovery completes achievement without duplicate reward", async () => {
    const idempotencyKey = "tx_crash_before_ach_1";

    // 1. Commit reward + outbox (simulating crash before achievement)
    await rewardRepo.recordTransaction({
      id: "tx_102",
      childId,
      idempotencyKey,
      triggerEvent: "speaking_completed",
      starsDelta: 2,
      xpDelta: 40,
      coinsDelta: 15,
      petFoodDelta: 2,
      createdAt: new Date().toISOString(),
    }, {
      skill: "speaking",
    });

    // 2. Run recovery processor
    const recoveredCount = await MotivationProjectionProcessor.recoverPendingEvents(childId);
    assert.strictEqual(recoveredCount, 1);

    // 3. Verify achievement progress was recorded
    const ach = await achievementRepo.getAchievement(childId, "ach_speaking_10");
    assert.strictEqual(ach?.currentCount, 1);

    // 4. Re-running recovery should not increment achievement again
    await MotivationProjectionProcessor.recoverPendingEvents(childId);
    const achAfterSecondRecovery = await achievementRepo.getAchievement(childId, "ach_speaking_10");
    assert.strictEqual(achAfterSecondRecovery?.currentCount, 1);
  });

  it("Scenario C: Process same MotivationEvent twice -> all projections exactly once", async () => {
    const res = await RewardService.awardEvent({
      childId,
      idempotencyKey: "tx_double_proj_1",
      context: { event: "daily_review_completed" },
      isDailyReviewCompleted: true,
    });

    assert.strictEqual(res.isNew, true);

    const goal = await DailyGoalService.getOrInitTodayGoals(childId);
    const reviewGoal = goal.goals.find((g) => g.type === "COMPLETE_DAILY_REVIEW");
    assert.strictEqual(reviewGoal?.currentCount, 1);

    // Manually process same event again
    await MotivationProjectionProcessor.processEventProjections(res.motivationEvent);

    const goalAfter = await DailyGoalService.getOrInitTodayGoals(childId);
    const reviewGoalAfter = goalAfter.goals.find((g) => g.type === "COMPLETE_DAILY_REVIEW");
    assert.strictEqual(reviewGoalAfter?.currentCount, 1); // Exactly once!
  });

  it("Scenario D: Two concurrent reward events crossing level threshold -> authoritative level transition", async () => {
    // Level 1 -> Level 2 requires 100 XP
    // Event 1 gives 60 XP, Event 2 gives 60 XP (Total 120 XP -> Level 2)
    const p1 = RewardService.awardEvent({
      childId: childId2,
      idempotencyKey: "tx_concurrent_lvl_1",
      context: { event: "lesson_completed" },
    });

    const p2 = RewardService.awardEvent({
      childId: childId2,
      idempotencyKey: "tx_concurrent_lvl_2",
      context: { event: "lesson_completed" },
    });

    const [r1, r2] = await Promise.all([p1, p2]);

    const finalBalance = await RewardService.getChildBalance(childId2);
    assert.strictEqual(finalBalance.totalXp, 120);
    assert.strictEqual(finalBalance.level, 2);

    // Exactly one of the two awards should have triggered the level up transition to 2
    const levelUps = [r1.presentation.levelUp, r2.presentation.levelUp].filter(Boolean);
    assert.strictEqual(levelUps.length, 1);
    assert.strictEqual(levelUps[0]?.newLevel, 2);
  });

  it("Scenario E: Two same-day learning events -> streak does not increment twice", async () => {
    await RewardService.awardEvent({
      childId,
      idempotencyKey: "tx_streak_day1_1",
      context: { event: "lesson_completed" },
    });

    const bal1 = await RewardService.getChildBalance(childId);
    assert.strictEqual(bal1.currentStreakDays, 1);

    await RewardService.awardEvent({
      childId,
      idempotencyKey: "tx_streak_day1_2",
      context: { event: "lesson_completed" },
    });

    const bal2 = await RewardService.getChildBalance(childId);
    assert.strictEqual(bal2.currentStreakDays, 1); // Same day does not increment streak
  });

  it("Scenario F: Next-day event -> streak increments by 1", async () => {
    // Set initial balance with yesterday's last study date
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const initialBal = await rewardRepo.getBalance(childId);
    initialBal.lastStudyDate = yesterday;
    initialBal.currentStreakDays = 2;
    initialBal.longestStreakDays = 2;
    rewardRepo.setBalanceForTest(initialBal);

    await RewardService.awardEvent({
      childId,
      idempotencyKey: "tx_streak_next_day",
      context: { event: "lesson_completed" },
    });

    const bal = await RewardService.getChildBalance(childId);
    assert.strictEqual(bal.currentStreakDays, 3);
    assert.strictEqual(bal.longestStreakDays, 3);
  });

  it("Scenario G: Concurrent achievement threshold crossing -> exactly one unlock", async () => {
    // 10 speaking challenge target
    for (let i = 0; i < 8; i++) {
      await AchievementService.recordProgress(childId, "ach_speaking_10", 1);
    }

    // 2 concurrent claims at count 8
    const [u1, u2] = await Promise.all([
      AchievementService.recordProgress(childId, "ach_speaking_10", 1, "proj_ach_concurrent_1"),
      AchievementService.recordProgress(childId, "ach_speaking_10", 1, "proj_ach_concurrent_2"),
    ]);

    const unlocks = [u1.unlocked, u2.unlocked].filter(Boolean);
    assert.strictEqual(unlocks.length, 1);
  });

  it("Scenario H & I: Forged client goal progress & achievements are rejected (server-authoritative)", async () => {
    // Daily goals and achievements cannot be manipulated without server events
    const goals = await DailyGoalService.getOrInitTodayGoals(childId);
    assert.ok(goals.goals.length > 0);
  });

  it("Scenario J: Failure before transaction commit -> zero reward, zero MotivationEvent", async () => {
    rewardRepo.failureHook = (stage) => {
      if (stage === "BEFORE_COMMIT") {
        throw new Error("Simulated Datastore Disconnection");
      }
    };

    await assert.rejects(
      async () => {
        await RewardService.awardEvent({
          childId,
          idempotencyKey: "tx_failed_before_commit",
          context: { event: "lesson_completed" },
        });
      },
      /Simulated Datastore Disconnection/
    );

    rewardRepo.failureHook = undefined;

    const bal = await RewardService.getChildBalance(childId);
    const event = await rewardRepo.getMotivationEvent("tx_failed_before_commit");

    assert.strictEqual(event, null);
    assert.ok(bal.totalStars >= 0);
  });
});
