import { describe, it } from "node:test";
import assert from "node:assert";
import { RewardEngine } from "./RewardEngine";
import { RewardPolicy } from "./RewardPolicy";
import { RewardBalance } from "@/types/reward";

describe("RewardEngine & RewardPolicy", () => {
  it("should calculate bonus rewards for spaced recall and weakness remediation", () => {
    const standardReward = RewardPolicy.evaluate({
      event: "review_recalled",
    });

    const bonusReward = RewardPolicy.evaluate({
      event: "review_recalled",
      isSpacedRecallBonus: true,
      isWeaknessRemediated: true,
    });

    assert.ok(bonusReward.xp > standardReward.xp);
    assert.ok(bonusReward.stars > standardReward.stars);
  });

  it("should process reward transactions and update balance and levels idempotently", () => {
    const initialBalance: RewardBalance = {
      childId: "child_1",
      totalStars: 10,
      totalXp: 180,
      totalCoins: 50,
      totalPetFood: 2,
      level: 1,
      updatedAt: new Date().toISOString(),
    };

    const tx = RewardEngine.processEvent(
      "child_1",
      "idem_key_100",
      { event: "lesson_completed" }
    );

    const updated = RewardEngine.applyTransaction(initialBalance, tx);
    assert.strictEqual(updated.totalStars, 13);
    assert.strictEqual(updated.totalXp, 230);
    assert.strictEqual(updated.level, 2); // Leveled up from 1 to 2
    assert.strictEqual(updated.totalPetFood, 4);
  });
});
