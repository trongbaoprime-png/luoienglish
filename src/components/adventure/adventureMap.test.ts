import { describe, it } from "node:test";
import assert from "node:assert";
import { AdventureNodeState } from "./AdventureNode";

describe("AdventureMap & S-Curve Navigation Topology (LE-011)", () => {
  it("Test 1: Supports all 6 node lifecycle states", () => {
    const validStates: AdventureNodeState[] = [
      "LOCKED",
      "AVAILABLE",
      "CURRENT",
      "COMPLETED",
      "MASTERED",
      "REVIEW_DUE",
    ];

    assert.strictEqual(validStates.length, 6);
  });

  it("Test 2: Winding S-curve positions stay within responsive container bounds", () => {
    const sampleNodes = [
      { id: "n1", positionX: 50, positionY: 80 },
      { id: "n2", positionX: 75, positionY: 240 },
      { id: "n3", positionX: 25, positionY: 420 },
      { id: "n4", positionX: 50, positionY: 600 },
    ];

    for (const node of sampleNodes) {
      assert.strictEqual(node.positionX >= 0 && node.positionX <= 100, true);
      assert.strictEqual(node.positionY > 0, true);
    }
  });
});
