import { KnowledgeMastery, MultidimensionalMastery, MemoryScheduleInput } from "@/types/memory";
import { SkillType } from "@/types/curriculum";
import { LearningEvidence, MasteryUpdateResult } from "@/types/learning";
import { SimpleSpacedRepetitionScheduler } from "@/engines/memory/SimpleSpacedRepetitionScheduler";

function mapToSchedulerSkill(skill: SkillType): MemoryScheduleInput["skillType"] {
  switch (skill) {
    case "listening":
      return "listening";
    case "speaking":
      return "speaking";
    case "reading":
      return "reading";
    case "writing":
      return "writing";
    case "phonics":
      return "pronunciation";
    case "communication":
      return "application";
    case "vocabulary":
    case "grammar":
    default:
      return "recognition";
  }
}

export class MasteryUpdatePolicy {
  private static scheduler = new SimpleSpacedRepetitionScheduler();

  public static applyEvidence(
    current: KnowledgeMastery,
    evidence: LearningEvidence
  ): MasteryUpdateResult {
    const isCorrect = evidence.correct;
    const latencySec = Math.max(0.5, (evidence.responseTimeMs || 2000) / 1000);

    const scheduleResult = this.scheduler.calculateNextReview({
      masteryScore: current.masteryScore,
      isCorrect,
      reviewCount: current.reviewCount + 1,
      latencySeconds: latencySec,
      skillType: mapToSchedulerSkill(evidence.skill),
    });

    const prevDim: MultidimensionalMastery = current.dimensions || {
      recognitionMastery: current.recognitionScore || 50,
      listeningMastery: current.listeningScore || 50,
      speakingMastery: current.speakingScore || 50,
      readingMastery: current.readingScore || 50,
      writingMastery: current.writingScore || 50,
      pronunciationMastery: 50,
      applicationMastery: 50,
      schoolCurriculumScore: 50,
      communicationCompetencyScore: 50,
      aggregateMasteryScore: current.masteryScore || 50,
    };

    const delta = isCorrect ? Math.min(15, Math.max(5, Math.round(evidence.score * 0.15))) : -15;

    const updatedDimensions: MultidimensionalMastery = {
      ...prevDim,
      recognitionMastery:
        evidence.skill === "vocabulary" || evidence.skill === "grammar"
          ? Math.min(100, Math.max(0, prevDim.recognitionMastery + delta))
          : prevDim.recognitionMastery,
      listeningMastery:
        evidence.skill === "listening"
          ? Math.min(100, Math.max(0, prevDim.listeningMastery + delta))
          : prevDim.listeningMastery,
      speakingMastery:
        evidence.skill === "speaking"
          ? Math.min(100, Math.max(0, prevDim.speakingMastery + delta))
          : prevDim.speakingMastery,
      readingMastery:
        evidence.skill === "reading"
          ? Math.min(100, Math.max(0, prevDim.readingMastery + delta))
          : prevDim.readingMastery,
      writingMastery:
        evidence.skill === "writing"
          ? Math.min(100, Math.max(0, prevDim.writingMastery + delta))
          : prevDim.writingMastery,
      pronunciationMastery:
        evidence.skill === "phonics"
          ? Math.min(100, Math.max(0, prevDim.pronunciationMastery + (evidence.pronunciationScore ? Math.round((evidence.pronunciationScore - 50) * 0.2) : delta)))
          : prevDim.pronunciationMastery,
      applicationMastery:
        evidence.skill === "communication"
          ? Math.min(100, Math.max(0, prevDim.applicationMastery + delta))
          : prevDim.applicationMastery,
      schoolCurriculumScore:
        evidence.skill === "grammar" || evidence.skill === "reading" || evidence.skill === "writing"
          ? Math.min(100, Math.max(0, prevDim.schoolCurriculumScore + delta))
          : prevDim.schoolCurriculumScore,
      communicationCompetencyScore:
        evidence.skill === "speaking" || evidence.skill === "listening" || evidence.skill === "communication"
          ? Math.min(100, Math.max(0, prevDim.communicationCompetencyScore + delta))
          : prevDim.communicationCompetencyScore,
      aggregateMasteryScore: scheduleResult.updatedMasteryScore,
    };

    return {
      knowledgeId: current.knowledgeId,
      previousScore: current.masteryScore,
      updatedScore: scheduleResult.updatedMasteryScore,
      dimensions: updatedDimensions,
      isWeakness: scheduleResult.isWeakness,
      nextReviewDays: scheduleResult.nextReviewDays,
    };
  }
}
