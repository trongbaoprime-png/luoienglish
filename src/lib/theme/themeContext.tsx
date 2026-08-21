"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeConfig, ThemeId } from "@/types/theme";
import { THEMES } from "./themeTokens";

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "cozy",
}: {
  children: React.ReactNode;
  initialTheme?: ThemeId;
}) {
  const [themeId, setThemeId] = useState<ThemeId>(initialTheme);

  useEffect(() => {
    const saved = localStorage.getItem("luoi_theme") as ThemeId | null;
    if (saved && (saved === "cozy" || saved === "explorer")) {
      setThemeId(saved);
    }
  }, []);

  const handleSetTheme = (newTheme: ThemeId) => {
    setThemeId(newTheme);
    localStorage.setItem("luoi_theme", newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: ThemeId = themeId === "cozy" ? "explorer" : "cozy";
    handleSetTheme(nextTheme);
  };

  const currentTheme = THEMES[themeId] || THEMES.cozy;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-cozy", "theme-explorer");
    root.classList.add(`theme-${themeId}`);

    // Update CSS custom properties
    const colors = currentTheme.colors;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-hover", colors.primaryHover);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--background", colors.background);
    root.style.setProperty("--foreground", colors.foreground);
    root.style.setProperty("--card", colors.card);
    root.style.setProperty("--card-foreground", colors.cardForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--muted", colors.muted);
    root.style.setProperty("--muted-foreground", colors.mutedForeground);
    root.style.setProperty("--border", colors.border);
  }, [themeId, currentTheme]);

  return (
    <ThemeContext.Provider
      value={{
        themeId,
        theme: currentTheme,
        setThemeId: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
