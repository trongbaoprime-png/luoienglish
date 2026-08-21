"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ThemeConfig, ThemeId } from "@/types/theme";
import { THEMES } from "./themeTokens";

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeConfig;
  activeChildId: string | null;
  setActiveChildId: (childId: string | null) => void;
  setThemeId: (id: ThemeId, targetChildId?: string) => void;
  toggleTheme: (targetChildId?: string) => void;
  getChildTheme: (childId: string) => ThemeId;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "cozy",
  initialChildId = null,
}: {
  children: React.ReactNode;
  initialTheme?: ThemeId;
  initialChildId?: string | null;
}) {
  const [activeChildId, setActiveChildIdState] = useState<string | null>(initialChildId);
  const [themeId, setThemeIdState] = useState<ThemeId>(initialTheme);

  // Helper to get storage key
  const getStorageKey = (childId: string | null): string => {
    return childId ? `luoi_theme_${childId}` : "luoi_theme_guest";
  };

  // Read theme for a specific child ID
  const getChildTheme = useCallback((childId: string): ThemeId => {
    if (typeof window === "undefined") return "cozy";
    const saved = localStorage.getItem(getStorageKey(childId)) as ThemeId | null;
    return saved && (saved === "cozy" || saved === "explorer") ? saved : "cozy";
  }, []);

  // Sync active theme when active child ID changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = getStorageKey(activeChildId);
    const saved = localStorage.getItem(key) as ThemeId | null;
    if (saved && (saved === "cozy" || saved === "explorer")) {
      setThemeIdState(saved);
    } else {
      setThemeIdState(initialTheme);
    }
  }, [activeChildId, initialTheme]);

  const handleSetActiveChildId = useCallback((childId: string | null) => {
    setActiveChildIdState(childId);
    if (typeof window !== "undefined") {
      const key = getStorageKey(childId);
      const saved = localStorage.getItem(key) as ThemeId | null;
      if (saved && (saved === "cozy" || saved === "explorer")) {
        setThemeIdState(saved);
      }
    }
  }, []);

  const handleSetTheme = useCallback((newTheme: ThemeId, targetChildId?: string) => {
    const childId = targetChildId !== undefined ? targetChildId : activeChildId;
    setThemeIdState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(getStorageKey(childId), newTheme);
    }
  }, [activeChildId]);

  const toggleTheme = useCallback((targetChildId?: string) => {
    const nextTheme: ThemeId = themeId === "cozy" ? "explorer" : "cozy";
    handleSetTheme(nextTheme, targetChildId);
  }, [themeId, handleSetTheme]);

  const currentTheme = THEMES[themeId] || THEMES.cozy;

  // Apply CSS custom properties and theme classes to HTML document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-cozy", "theme-explorer");
    root.classList.add(`theme-${themeId}`);

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
        activeChildId,
        setActiveChildId: handleSetActiveChildId,
        setThemeId: handleSetTheme,
        toggleTheme,
        getChildTheme,
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
