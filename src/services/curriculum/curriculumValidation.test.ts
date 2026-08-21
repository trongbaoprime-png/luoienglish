import { describe, it } from "node:test";
import assert from "node:assert";
import { CurriculumValidator } from "@/domain/curriculum/CurriculumValidator";
import { masterCurriculum } from "@/domain/curriculum/seedGrade3";
import { InMemoryCurriculumRepository } from "@/repositories/memory/InMemoryCurriculumRepository";
import { Curriculum } from "@/types/curriculum";

describe("Curriculum Knowledge Graph & Validation Engine (LE-006)", () => {
  it("Validates Grade 3 master curriculum seed with 100% clean schema", () => {
    const report = CurriculumValidator.validate(masterCurriculum);
    assert.strictEqual(report.isValid, true, `Validation failed: ${report.errors.join("; ")}`);
    assert.strictEqual(report.errors.length, 0);
    assert.ok(report.stats.totalKnowledgeItems >= 10);
    assert.ok(report.stats.totalObjectives >= 2);
    assert.ok(report.stats.totalGraphEdges >= 8);
  });

  it("Detects duplicate IDs in curriculum tree", () => {
    const invalidCurriculum: Curriculum = {
      ...masterCurriculum,
      grades: [
        {
          ...masterCurriculum.grades[0]!,
          units: [
            ...masterCurriculum.grades[0]!.units,
            {
              ...masterCurriculum.grades[0]!.units[0]!,
              id: "unit_g3_u1", // Duplicate unit ID
            },
          ],
        },
      ],
    };

    const report = CurriculumValidator.validate(invalidCurriculum);
    assert.strictEqual(report.isValid, false);
    assert.ok(report.errors.some((e) => e.includes("Duplicate ID detected")));
  });

  it("Detects broken graph edges (referencing non-existent targetId)", () => {
    const brokenCurriculum: Curriculum = {
      ...masterCurriculum,
      knowledgeGraphNodes: [
        {
          ...masterCurriculum.knowledgeGraphNodes![0]!,
          id: "k_broken_node",
          relations: [
            {
              targetId: "k_ghost_non_existent_target",
              relationType: "prerequisite",
            },
          ],
        },
      ],
    };

    const report = CurriculumValidator.validate(brokenCurriculum);
    assert.strictEqual(report.isValid, false);
    assert.ok(report.errors.some((e) => e.includes("Broken graph edge")));
  });

  it("Detects cyclic prerequisite dependencies (DFS cycle detection)", () => {
    const cyclicCurriculum: Curriculum = {
      ...masterCurriculum,
      knowledgeGraphNodes: [
        {
          ...masterCurriculum.knowledgeGraphNodes![0]!,
          id: "node_A",
          relations: [{ targetId: "node_B", relationType: "prerequisite" }],
        },
        {
          ...masterCurriculum.knowledgeGraphNodes![1]!,
          id: "node_B",
          relations: [{ targetId: "node_C", relationType: "prerequisite" }],
        },
        {
          ...masterCurriculum.knowledgeGraphNodes![2]!,
          id: "node_C",
          relations: [{ targetId: "node_A", relationType: "prerequisite" }], // Cycle!
        },
      ],
    };

    const report = CurriculumValidator.validate(cyclicCurriculum);
    assert.strictEqual(report.isValid, false);
    assert.ok(report.errors.some((e) => e.includes("Cyclic prerequisite detected")));
  });

  it("Repository provides Knowledge Graph relationship traversals", async () => {
    const repo = new InMemoryCurriculumRepository();

    // Query prerequisites of "What's your name?"
    const prereqs = await repo.getPrerequisites("k_g3_u2_whats_your_name");
    assert.ok(prereqs.length >= 1);
    assert.strictEqual(prereqs[0]?.id, "k_g3_u2_name");

    // Query phonics knowledge items
    const phonicsItems = await repo.findKnowledgeBySkill("phonics");
    assert.ok(phonicsItems.length >= 2);
    assert.ok(phonicsItems.some((k) => k.primaryText.includes("/h/")));
    assert.ok(phonicsItems.some((k) => k.primaryText.includes("/n/")));
  });

  it("Learning Objectives answer all 7 core pedagogical questions", async () => {
    const repo = new InMemoryCurriculumRepository();
    const obj = await repo.getLearningObjective("obj_g3_u1_greetings");

    assert.ok(obj);
    assert.ok(obj.understandStatement.length > 5);
    assert.ok(obj.recognizeStatement.length > 5);
    assert.ok(obj.sayStatement.length > 5);
    assert.ok(obj.hearStatement.length > 5);
    assert.ok(obj.readStatement.length > 5);
    assert.ok(obj.writeStatement.length > 5);
    assert.ok(obj.realWorldContext.length > 5);
  });
});
