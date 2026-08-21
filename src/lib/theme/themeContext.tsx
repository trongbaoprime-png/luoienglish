"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ThemeConfig, ThemeId } from "@/types/theme";
import { ChildProfile } from "@/types/student";
import { THEMES } from "./themeTokens";
import { IChildRepository } from "@/repositories/interfaces/IChildRepository";

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeConfig;
  activeChildId: string | null;
  activeChildProfile: ChildProfile | null;
  setActiveChildId: (childId: string | null) => void;
  setActiveChildProfile: (profile: ChildProfile | null) => void;
  syncFromChildProfile: (profile: ChildProfile) => void;
  setThemeId: (id: ThemeId, targetChildId?: string, childRepo?: IChildRepository) => Promise<void>;
  toggleTheme: (targetChildId?: string, childRepo?: IChildRepository) => Promise<void>;
  getChildCachedTheme: (childId: string) => ThemeId;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "cozy",
  initialChildId = null,
  initialChildProfile = null,
}: {
  children: React.ReactNode;
  initialTheme?: ThemeId;
  initialChildId?: string | null;
  initialChildProfile?: ChildProfile | null;
}) {
  const [activeChildId, setActiveChildIdState] = useState<string | null>(initialChildId);
  const [activeChildProfile, setActiveChildProfileState] = useState<ChildProfile | null>(
    initialChildProfile
  );
  const [themeId, setThemeIdState] = useState<ThemeId>(initialTheme);

  // Helper to get local cache storage key
  const getStorageKey = (childId: string | null): string => {
    return childId ? `luoi_theme_${childId}` : "luoi_theme_guest";
  };

  // Read theme from local cache for instant fallback
  const getChildCachedTheme = useCallback((childId: string): ThemeId => {
    if (typeof window === "undefined") return "cozy";
    const saved = localStorage.getItem(getStorageKey(childId)) as ThemeId | null;
    return saved && (saved === "cozy" || saved === "explorer") ? saved : "cozy";
  }, []);

  // Sync state and cache when a ChildProfile is loaded as source of truth
  const syncFromChildProfile = useCallback((profile: ChildProfile) => {
    setActiveChildIdState(profile.id);
    setActiveChildProfileState(profile);

    const authoritativeTheme: ThemeId =
      profile.preferences?.themeId ||
      profile.themePreference ||
      "cozy";

    setThemeIdState(authoritativeTheme);

    // Update local cache with authoritative source of truth
    if (typeof window !== "undefined") {
      localStorage.setItem(getStorageKey(profile.id), authoritativeTheme);
    }
  }, []);

  // Sync theme when activeChildId changes (reading from cache fallback first)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (activeChildProfile && activeChildProfile.id === activeChildId) {
      const authoritativeTheme =
        activeChildProfile.preferences?.themeId ||
        activeChildProfile.themePreference ||
        "cozy";
      setThemeIdState(authoritativeTheme);
      return;
    }

    const key = getStorageKey(activeChildId);
    const cached = localStorage.getItem(key) as ThemeId | null;
    if (cached && (cached === "cozy" || cached === "explorer")) {
      setThemeIdState(cached);
    } else {
      setThemeIdState(initialTheme);
    }
  }, [activeChildId, activeChildProfile, initialTheme]);

  const handleSetActiveChildId = useCallback((childId: string | null) => {
    setActiveChildIdState(childId);
    if (!childId) {
      setActiveChildProfileState(null);
    }
  }, []);

  const handleSetActiveChildProfile = useCallback((profile: ChildProfile | null) => {
    if (profile) {
      syncFromChildProfile(profile);
    } else {
      setActiveChildIdState(null);
      setActiveChildProfileState(null);
    }
  }, [syncFromChildProfile]);

  const handleSetTheme = useCallback(
    async (newTheme: ThemeId, targetChildId?: string, childRepo?: IChildRepository) => {
      const childId = targetChildId !== undefined ? targetChildId : activeChildId;
      setThemeIdState(newTheme);

      // 1. Update local cache immediately for zero-flicker UI
      if (typeof window !== "undefined") {
        localStorage.setItem(getStorageKey(childId), newTheme);
      }

      // 2. If an authenticated child ID is active or targeted, persist to Firestore profile (Source of Truth)
      if (childId && childRepo) {
        try {
          await childRepo.update(childId, {
            preferences: {
              themeId: newTheme,
            },
          });
          if (activeChildProfile && activeChildProfile.id === childId) {
            setActiveChildProfileState({
              ...activeChildProfile,
              preferences: {
                ...activeChildProfile.preferences,
                themeId: newTheme,
              },
              themePreference: newTheme,
            });
          }
        } catch (err) {
          console.warn("[ThemeProvider] Failed to persist theme to Firestore profile:", err);
        }
      }
    },
    [activeChildId, activeChildProfile]
  );

  const toggleTheme = useCallback(
    async (targetChildId?: string, childRepo?: IChildRepository) => {
      const nextTheme: ThemeId = themeId === "cozy" ? "explorer" : "cozy";
      await handleSetTheme(nextTheme, targetChildId, childRepo);
    },
    [themeId, handleSetTheme]
  );

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
        activeChildProfile,
        setActiveChildId: handleSetActiveChildId,
        setActiveChildProfile: handleSetActiveChildProfile,
        syncFromChildProfile,
        setThemeId: handleSetTheme,
        toggleTheme,
        getChildCachedTheme,
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
