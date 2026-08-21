import { describe, it } from "node:test";
import assert from "node:assert";
import { MemoryEngine } from "./MemoryEngine";
import { SimpleSpacedRepetitionScheduler } from "./SimpleSpacedRepetitionScheduler";
import { KnowledgeMastery } from "@/types/memory";

describe("MemoryEngine & SimpleSpacedRepetitionScheduler", () => {
  const scheduler = new SimpleSpacedRepetitionScheduler();
  const engine = new MemoryEngine(scheduler);

  const initialMastery: KnowledgeMastery = {
    id: "m_1",
    studentId: "child_1",
    knowledgeId: "vocab_hello",
    recognitionScore: 50,
    recallScore: 40,
    listeningScore: 50,
    speakingScore: 40,
    readingScore: 50,
    writingScore: 40,
    masteryScore: 45,
    lastSeenAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextReviewAt: new Date().toISOString(),
    reviewCount: 1,
    consecutiveCorrectStreak: 1,
    isWeakness: false,
  };

  it("should increase mastery score and schedule spaced interval on correct recall", () => {
    const updated = engine.processRecallAttempt(initialMastery, true, 1.5);
    assert.ok(updated.masteryScore > initialMastery.masteryScore);
    assert.strictEqual(updated.consecutiveCorrectStreak, 2);
    assert.strictEqual(updated.reviewCount, 2);
  });

  it("should penalize mastery and schedule 1-day review on incorrect recall", () => {
    const updated = engine.processRecallAttempt(initialMastery, false, 3.0);
    assert.ok(updated.masteryScore < initialMastery.masteryScore);
    assert.strictEqual(updated.consecutiveCorrectStreak, 0);
    assert.strictEqual(updated.isWeakness, true);

    const nextReview = new Date(updated.nextReviewAt).getTime();
    const now = Date.now();
    const diffDays = Math.round((nextReview - now) / (1000 * 60 * 60 * 24));
    assert.strictEqual(diffDays, 1);
  });

  it("should correctly prioritize review queue with weakness items first", () => {
    const items: KnowledgeMastery[] = [
      { ...initialMastery, knowledgeId: "item_strong", masteryScore: 95, isWeakness: false },
      { ...initialMastery, knowledgeId: "item_weak", masteryScore: 30, isWeakness: true },
    ];

    const queue = engine.generateReviewQueue(items);
    assert.strictEqual(queue.length, 2);
    assert.strictEqual(queue[0].knowledgeId, "item_weak");
  });
});
