import { describe, it } from "node:test";
import assert from "node:assert";
import { MotionRegistry, MOTION_TOKENS } from "./motionRegistry";

describe("MotionRegistry & Semantic Animation Tokens (LE-011)", () => {
  it("Test 1: Resolves standard motion tokens correctly", () => {
    const fast = MotionRegistry.getMotion("motion.fast");
    assert.strictEqual(fast.durationMs, 150);

    const normal = MotionRegistry.getMotion("motion.normal");
    assert.strictEqual(normal.durationMs, 300);

    const bounce = MotionRegistry.getMotion("motion.bounce.small");
    assert.strictEqual(bounce.durationMs, 400);
  });

  it("Test 2: Reduced motion mode clamps animations to instant or minimal linear fades", () => {
    const reducedFast = MotionRegistry.getMotion("motion.fast", true);
    assert.strictEqual(reducedFast.durationMs, 150);
    assert.strictEqual(reducedFast.easing, "linear");

    const reducedInstant = MotionRegistry.getMotion("motion.instant", true);
    assert.strictEqual(reducedInstant.durationMs, 0);
  });

  it("Test 3: Exposes complete set of required semantic tokens", () => {
    assert.strictEqual(typeof MOTION_TOKENS["motion.rewardFly"], "object");
    assert.strictEqual(typeof MOTION_TOKENS["motion.mapUnlock"], "object");
    assert.strictEqual(typeof MOTION_TOKENS["motion.breathe"], "object");
  });
});
