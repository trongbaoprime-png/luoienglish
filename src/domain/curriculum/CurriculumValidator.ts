import {
  Curriculum,
  CurriculumGrade,
  Unit,
  Lesson,
  LearningObjective,
  KnowledgeItem,
  Activity,
  CefrLevel,
} from "@/types/curriculum";

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalGrades: number;
    totalUnits: number;
    totalLessons: number;
    totalObjectives: number;
    totalKnowledgeItems: number;
    totalActivities: number;
    totalGraphEdges: number;
  };
}

const VALID_CEFR_LEVELS: CefrLevel[] = ["Pre-A1", "A1", "A1+", "A2", "B1", "B2"];

export class CurriculumValidator {
  public static validate(curriculum: Curriculum): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];
    const seenEntityIds = new Set<string>();

    const allKnowledgeItems = new Map<string, KnowledgeItem>();
    const allObjectives = new Map<string, LearningObjective>();

    let totalGrades = 0;
    let totalUnits = 0;
    let totalLessons = 0;
    let totalActivities = 0;
    let totalGraphEdges = 0;

    // 1. Validate Top-Level Curriculum
    if (!curriculum.id?.trim()) {
      errors.push("Curriculum ID is missing or empty.");
    } else {
      this.checkDuplicateId(curriculum.id, seenEntityIds, "Curriculum", errors);
    }

    if (!curriculum.title?.trim()) {
      errors.push("Curriculum title is missing.");
    }

    // Index standalone graph nodes if present
    if (curriculum.knowledgeGraphNodes) {
      for (const item of curriculum.knowledgeGraphNodes) {
        this.indexKnowledgeItem(item, allKnowledgeItems, errors, warnings);
      }
    }

    // 2. Traverse Grades
    for (const grade of curriculum.grades) {
      totalGrades++;
      if (grade.grade < 1 || grade.grade > 12) {
        errors.push(`Grade level ${grade.grade} is out of bounds (allowed: 1 to 12).`);
      }

      if (!VALID_CEFR_LEVELS.includes(grade.targetCefrLevel)) {
        errors.push(`Grade ${grade.grade} has invalid target CEFR level: '${grade.targetCefrLevel}'.`);
      }

      // 3. Traverse Units
      for (const unit of grade.units) {
        totalUnits++;
        this.validateUnit(unit, grade, seenEntityIds, allKnowledgeItems, allObjectives, errors, warnings);
        totalLessons += unit.lessons.length;

        for (const lesson of unit.lessons) {
          totalActivities += lesson.activities.length;
        }
      }
    }

    // 4. Validate Knowledge Graph Relationships & Prerequisites
    for (const item of allKnowledgeItems.values()) {
      for (const rel of item.relations || []) {
        totalGraphEdges++;
        if (!allKnowledgeItems.has(rel.targetId)) {
          errors.push(
            `Broken graph edge: KnowledgeItem '${item.id}' references non-existent targetId '${rel.targetId}' (relation: ${rel.relationType}).`
          );
        }
      }

      // Validate learning objective links
      for (const objId of item.learningObjectiveIds || []) {
        if (!allObjectives.has(objId)) {
          errors.push(
            `Broken objective link: KnowledgeItem '${item.id}' references non-existent LearningObjective '${objId}'.`
          );
        }
      }

      // Validate recall variants
      if (!item.recallVariants || item.recallVariants.length === 0) {
        warnings.push(
          `KnowledgeItem '${item.id}' has no contextual recall variants for MemoryEngine.`
        );
      }
    }

    // 5. Detect Cyclic Prerequisites (Graph DFS Cycle Detection)
    const cycleError = this.detectPrerequisiteCycles(allKnowledgeItems);
    if (cycleError) {
      errors.push(`Cyclic prerequisite detected in Knowledge Graph: ${cycleError}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      stats: {
        totalGrades,
        totalUnits,
        totalLessons,
        totalObjectives: allObjectives.size,
        totalKnowledgeItems: allKnowledgeItems.size,
        totalActivities,
        totalGraphEdges,
      },
    };
  }

  private static validateUnit(
    unit: Unit,
    grade: CurriculumGrade,
    seenIds: Set<string>,
    allKnowledge: Map<string, KnowledgeItem>,
    allObjectives: Map<string, LearningObjective>,
    errors: string[],
    warnings: string[]
  ) {
    if (!unit.id?.trim()) {
      errors.push(`Unit in grade ${grade.grade} is missing an ID.`);
    } else {
      this.checkDuplicateId(unit.id, seenIds, "Unit", errors);
    }

    if (!unit.topicName?.trim()) {
      errors.push(`Unit '${unit.id}' is missing topicName.`);
    }

    if (unit.grade !== grade.grade) {
      errors.push(`Unit '${unit.id}' grade (${unit.grade}) does not match parent grade (${grade.grade}).`);
    }

    for (const lesson of unit.lessons) {
      this.validateLesson(lesson, unit, seenIds, allKnowledge, allObjectives, errors, warnings);
    }
  }

  private static validateLesson(
    lesson: Lesson,
    unit: Unit,
    seenIds: Set<string>,
    allKnowledge: Map<string, KnowledgeItem>,
    allObjectives: Map<string, LearningObjective>,
    errors: string[],
    warnings: string[]
  ) {
    if (!lesson.id?.trim()) {
      errors.push(`Lesson in unit '${unit.id}' is missing an ID.`);
    } else {
      this.checkDuplicateId(lesson.id, seenIds, "Lesson", errors);
    }

    if (lesson.unitId !== unit.id) {
      errors.push(`Lesson '${lesson.id}' unitId ('${lesson.unitId}') does not match parent unit '${unit.id}'.`);
    }

    if (!lesson.learningObjectives || lesson.learningObjectives.length === 0) {
      errors.push(`Lesson '${lesson.id}' has no learning objectives specified.`);
    } else {
      for (const obj of lesson.learningObjectives) {
        this.indexObjective(obj, allObjectives, seenIds, errors);
      }
    }

    for (const item of lesson.knowledgeItems || []) {
      this.indexKnowledgeItem(item, allKnowledge, errors, warnings);
    }

    for (const activity of lesson.activities || []) {
      this.validateActivity(activity, lesson, seenIds, allKnowledge, errors);
    }
  }

  private static validateActivity(
    act: Activity,
    lesson: Lesson,
    seenIds: Set<string>,
    allKnowledge: Map<string, KnowledgeItem>,
    errors: string[]
  ) {
    if (!act.id?.trim()) {
      errors.push(`Activity in lesson '${lesson.id}' is missing an ID.`);
    } else {
      this.checkDuplicateId(act.id, seenIds, "Activity", errors);
    }

    if (!act.knowledgeItemIds || act.knowledgeItemIds.length === 0) {
      errors.push(`Activity '${act.id}' does not bind to any knowledge items.`);
    } else {
      for (const kId of act.knowledgeItemIds) {
        if (!allKnowledge.has(kId)) {
          errors.push(`Activity '${act.id}' references unknown KnowledgeItem '${kId}'.`);
        }
      }
    }

    if (act.options && act.options.length > 0) {
      const correctCount = act.options.filter((o) => o.isCorrect).length;
      if (correctCount === 0) {
        errors.push(`Activity '${act.id}' options has 0 correct choices.`);
      }
    }
  }

  private static indexObjective(
    obj: LearningObjective,
    allObjectives: Map<string, LearningObjective>,
    seenIds: Set<string>,
    errors: string[]
  ) {
    if (!obj.id?.trim()) {
      errors.push("LearningObjective ID is missing.");
      return;
    }

    if (allObjectives.has(obj.id)) {
      // Reused objective across lessons is permitted
      return;
    }

    this.checkDuplicateId(obj.id, seenIds, "LearningObjective", errors);
    allObjectives.set(obj.id, obj);

    if (!obj.understandStatement?.trim()) {
      errors.push(`Objective '${obj.id}' missing understandStatement.`);
    }
    if (!obj.realWorldContext?.trim()) {
      errors.push(`Objective '${obj.id}' missing realWorldContext.`);
    }
  }

  private static indexKnowledgeItem(
    item: KnowledgeItem,
    allKnowledge: Map<string, KnowledgeItem>,
    errors: string[],
    warnings: string[]
  ) {
    if (!item.id?.trim()) {
      errors.push("KnowledgeItem ID is missing.");
      return;
    }

    if (allKnowledge.has(item.id)) {
      // Node is reused in graph/lesson — valid
      return;
    }

    allKnowledge.set(item.id, item);

    if (!item.primaryText?.trim()) {
      errors.push(`KnowledgeItem '${item.id}' is missing primaryText.`);
    }

    if (!item.vietnameseMeaning?.trim()) {
      errors.push(`KnowledgeItem '${item.id}' is missing vietnameseMeaning.`);
    }

    if (!item.skillFocus || item.skillFocus.length === 0) {
      errors.push(`KnowledgeItem '${item.id}' has empty skillFocus.`);
    }

    if (!item.schoolAlignment) {
      errors.push(`KnowledgeItem '${item.id}' missing schoolAlignment metadata.`);
    }

    if (!item.communicationCompetency) {
      errors.push(`KnowledgeItem '${item.id}' missing communicationCompetency metadata.`);
    }

    if (!item.recallVariants || item.recallVariants.length === 0) {
      warnings.push(`KnowledgeItem '${item.id}' has 0 recall variants.`);
    }
  }

  private static checkDuplicateId(
    id: string,
    seenIds: Set<string>,
    entityType: string,
    errors: string[]
  ) {
    if (seenIds.has(id)) {
      errors.push(`Duplicate ID detected: '${id}' in ${entityType}.`);
    } else {
      seenIds.add(id);
    }
  }

  /**
   * DFS Cycle Detection on "prerequisite" directed graph edges
   */
  private static detectPrerequisiteCycles(nodes: Map<string, KnowledgeItem>): string | null {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string, path: string[]): string | null => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const node = nodes.get(nodeId);
      if (node && node.relations) {
        for (const rel of node.relations) {
          if (rel.relationType === "prerequisite") {
            const nextId = rel.targetId;
            if (!visited.has(nextId)) {
              const cycle = dfs(nextId, [...path, nextId]);
              if (cycle) return cycle;
            } else if (recStack.has(nextId)) {
              return [...path, nextId].join(" -> ");
            }
          }
        }
      }

      recStack.delete(nodeId);
      return null;
    };

    for (const nodeId of nodes.keys()) {
      if (!visited.has(nodeId)) {
        const cycle = dfs(nodeId, [nodeId]);
        if (cycle) return cycle;
      }
    }

    return null;
  }
}
