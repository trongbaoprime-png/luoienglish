"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ThemeConfig, ThemeId } from "@/types/theme";
import { ChildProfile } from "@/types/student";
import { THEMES } from "./themeTokens";
import { IChildRepository } from "@/repositories/interfaces/IChildRepository";

export type ThemeSyncStatus = "synced" | "syncing" | "error" | "guest";

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeConfig;
  activeChildId: string | null;
  activeChildProfile: ChildProfile | null;
  syncStatus: ThemeSyncStatus;
  syncError: string | null;
  setActiveChildId: (childId: string | null) => void;
  setActiveChildProfile: (profile: ChildProfile | null) => void;
  syncFromChildProfile: (profile: ChildProfile) => void;
  setThemeId: (id: ThemeId, targetChildId?: string, childRepo?: IChildRepository) => Promise<boolean>;
  toggleTheme: (targetChildId?: string, childRepo?: IChildRepository) => Promise<boolean>;
  retrySyncTheme: (childRepo: IChildRepository) => Promise<boolean>;
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
  const [syncStatus, setSyncStatus] = useState<ThemeSyncStatus>(initialChildProfile ? "synced" : "guest");
  const [syncError, setSyncError] = useState<string | null>(null);

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
    setSyncStatus("synced");
    setSyncError(null);

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
      setSyncStatus("synced");
      return;
    }

    const key = getStorageKey(activeChildId);
    const cached = localStorage.getItem(key) as ThemeId | null;
    if (cached && (cached === "cozy" || cached === "explorer")) {
      setThemeIdState(cached);
    } else {
      setThemeIdState(initialTheme);
    }
    setSyncStatus(activeChildId ? "synced" : "guest");
  }, [activeChildId, activeChildProfile, initialTheme]);

  const handleSetActiveChildId = useCallback((childId: string | null) => {
    setActiveChildIdState(childId);
    if (!childId) {
      setActiveChildProfileState(null);
      setSyncStatus("guest");
      setSyncError(null);
    }
  }, []);

  const handleSetActiveChildProfile = useCallback((profile: ChildProfile | null) => {
    if (profile) {
      syncFromChildProfile(profile);
    } else {
      setActiveChildIdState(null);
      setActiveChildProfileState(null);
      setSyncStatus("guest");
      setSyncError(null);
    }
  }, [syncFromChildProfile]);

  const handleSetTheme = useCallback(
    async (
      newTheme: ThemeId,
      targetChildId?: string,
      childRepo?: IChildRepository
    ): Promise<boolean> => {
      const childId = targetChildId !== undefined ? targetChildId : activeChildId;
      const previousTheme = themeId;

      // 1. Optimistically apply in local state
      setThemeIdState(newTheme);
      setSyncError(null);

      // 2. If guest / unauthenticated mode, update cache and finish
      if (!childId || !childRepo) {
        if (typeof window !== "undefined") {
          localStorage.setItem(getStorageKey(childId), newTheme);
        }
        setSyncStatus(childId ? "synced" : "guest");
        return true;
      }

      // 3. For authenticated child profile: Firestore is authoritative Source of Truth
      setSyncStatus("syncing");

      try {
        await childRepo.update(childId, {
          preferences: {
            themeId: newTheme,
          },
        });

        // Update local cache ONLY upon successful authoritative write
        if (typeof window !== "undefined") {
          localStorage.setItem(getStorageKey(childId), newTheme);
        }

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

        setSyncStatus("synced");
        return true;
      } catch (err: unknown) {
        // Rollback optimistic state on Firestore persistence failure
        console.error("[ThemeProvider] Failed to persist theme to Firestore profile. Rolling back.", err);
        setThemeIdState(previousTheme);
        if (typeof window !== "undefined") {
          localStorage.setItem(getStorageKey(childId), previousTheme);
        }
        setSyncStatus("error");
        setSyncError(err instanceof Error ? err.message : "Failed to persist theme preference.");
        return false;
      }
    },
    [activeChildId, activeChildProfile, themeId]
  );

  const toggleTheme = useCallback(
    async (targetChildId?: string, childRepo?: IChildRepository): Promise<boolean> => {
      const nextTheme: ThemeId = themeId === "cozy" ? "explorer" : "cozy";
      return await handleSetTheme(nextTheme, targetChildId, childRepo);
    },
    [themeId, handleSetTheme]
  );

  const retrySyncTheme = useCallback(
    async (childRepo: IChildRepository): Promise<boolean> => {
      if (!activeChildId) return false;
      return await handleSetTheme(themeId, activeChildId, childRepo);
    },
    [activeChildId, themeId, handleSetTheme]
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
        syncStatus,
        syncError,
        setActiveChildId: handleSetActiveChildId,
        setActiveChildProfile: handleSetActiveChildProfile,
        syncFromChildProfile,
        setThemeId: handleSetTheme,
        toggleTheme,
        retrySyncTheme,
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
