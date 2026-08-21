import { ThemeConfig } from "@/types/theme";

export const COZY_THEME: ThemeConfig = {
  id: "cozy",
  name: "Cozy Lười",
  nameVi: "Chú Lười Ấm Áp",
  descriptionVi: "Không gian êm đềm, ấm cúng như thư viện trên cây.",
  colors: {
    primary: "#F59E0B",          // Amber 500
    primaryHover: "#D97706",     // Amber 600
    primaryForeground: "#FFFFFF",
    secondary: "#10B981",        // Emerald 500
    secondaryForeground: "#FFFFFF",
    background: "#FFFBEB",       // Amber 50
    foreground: "#451A03",       // Amber 950
    card: "#FFFFFF",
    cardForeground: "#78350F",
    accent: "#FDE68A",          // Amber 200
    accentForeground: "#78350F",
    muted: "#FEF3C7",           // Amber 100
    mutedForeground: "#92400E",
    border: "#FDE68A",
  },
  mascotSkinId: "mascot.sloth.cozy",
  soundPack: "cozy_acoustic",
};

export const EXPLORER_THEME: ThemeConfig = {
  id: "explorer",
  name: "Explorer Lười",
  nameVi: "Chú Lười Thám Hiểm",
  descriptionVi: "Cuộc phiêu lưu tràn đầy năng lượng trên các hòn đảo kỳ thú.",
  colors: {
    primary: "#0284C7",          // Sky 600
    primaryHover: "#0369A1",     // Sky 700
    primaryForeground: "#FFFFFF",
    secondary: "#EAB308",        // Yellow 500
    secondaryForeground: "#0F172A",
    background: "#F0FDF4",       // Green 50
    foreground: "#0F172A",       // Slate 900
    card: "#FFFFFF",
    cardForeground: "#0369A1",
    accent: "#BAE6FD",          // Sky 200
    accentForeground: "#0369A1",
    muted: "#E0F2FE",           // Sky 100
    mutedForeground: "#075985",
    border: "#BAE6FD",
  },
  mascotSkinId: "mascot.sloth.explorer",
  soundPack: "explorer_upbeat",
};

export const THEMES: Record<string, ThemeConfig> = {
  cozy: COZY_THEME,
  explorer: EXPLORER_THEME,
};
