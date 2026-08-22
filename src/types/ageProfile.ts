/**
 * Age-Adaptive Visual System
 * Defines age profiles to modulate visual maturity, mascot dominance,
 * and typography scaling across Grade 1 to 12.
 */

export type ExperienceAgeProfile = "junior" | "kids" | "preteen" | "teen";

export interface AgeProfileConfig {
  id: ExperienceAgeProfile;
  grades: number[];
  displayNameVi: string;
  mascotDominance: "high" | "moderate" | "subtle" | "companion_only";
  typographyScale: "chunky_rounded" | "standard_rounded" | "clean_modern" | "editorial";
  illustrationStyle: "storybook_chibi" | "adventure_illustrated" | "stylized_graphic" | "mature_modern";
}

export const AGE_PROFILE_CONFIGS: Record<ExperienceAgeProfile, AgeProfileConfig> = {
  junior: {
    id: "junior",
    grades: [1, 2],
    displayNameVi: "Khởi Đầu — Lớp 1-2",
    mascotDominance: "high",
    typographyScale: "chunky_rounded",
    illustrationStyle: "storybook_chibi",
  },
  kids: {
    id: "kids",
    grades: [3, 4, 5],
    displayNameVi: "Tiểu Học — Lớp 3-5",
    mascotDominance: "high",
    typographyScale: "standard_rounded",
    illustrationStyle: "adventure_illustrated",
  },
  preteen: {
    id: "preteen",
    grades: [6, 7, 8, 9],
    displayNameVi: "THCS — Lớp 6-9",
    mascotDominance: "moderate",
    typographyScale: "clean_modern",
    illustrationStyle: "stylized_graphic",
  },
  teen: {
    id: "teen",
    grades: [10, 11, 12],
    displayNameVi: "THPT — Lớp 10-12",
    mascotDominance: "subtle",
    typographyScale: "editorial",
    illustrationStyle: "mature_modern",
  },
};

export function getAgeProfileForGrade(grade: number): ExperienceAgeProfile {
  if (grade <= 2) return "junior";
  if (grade <= 5) return "kids";
  if (grade <= 9) return "preteen";
  return "teen";
}
