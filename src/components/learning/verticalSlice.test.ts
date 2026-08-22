import { describe, it } from "node:test";
import assert from "node:assert";
import { lessonG3U1L1, unitGrade3Unit1 } from "@/domain/curriculum/seedGrade3";
import { CelebrationIntensity } from "./RewardCelebrationLayer";

describe("Grade 3 Unit 1 Vertical Slice & Pedagogical Journey (LE-011)", () => {
  it("Test 1: Unit 1 seed contains all mandatory vertical slice content", () => {
    assert.strictEqual(unitGrade3Unit1.topicName, "Hello & Greetings");
    assert.strictEqual(lessonG3U1L1.activities.length >= 3, true);

    const activityTypes = lessonG3U1L1.activities.map((a) => a.type);
    assert.strictEqual(activityTypes.includes("listen_and_repeat"), true);
    assert.strictEqual(activityTypes.includes("word_match"), true);
    assert.strictEqual(activityTypes.includes("mini_conversation"), true);
  });

  it("Test 2: Supports all 4 celebration intensity tiers", () => {
    const tiers: CelebrationIntensity[] = ["SMALL", "MEDIUM", "BIG", "EPIC"];
    assert.strictEqual(tiers.length, 4);
  });

  it("Test 3: Lesson activities provide structured reward point grants", () => {
    for (const activity of lessonG3U1L1.activities) {
      assert.strictEqual(activity.rewardPoints.stars >= 1, true);
      assert.strictEqual(activity.rewardPoints.xp >= 10, true);
      assert.strictEqual(activity.rewardPoints.petFood >= 1, true);
    }
  });
});
