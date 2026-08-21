/**
 * Dual-Theme System Domain Types
 */

export type ThemeId = "cozy" | "explorer";

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  nameVi: string;
  descriptionVi: string;
  colors: ThemeColors;
  mascotSkinId: string;
  soundPack: string;
}
