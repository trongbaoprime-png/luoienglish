"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { UserProfile, ChildSession } from "@/types/auth";
import { ChildProfile } from "@/types/student";
import { IAuthService, FirebaseAuthService } from "@/services/auth/AuthService";
import { MockAuthService } from "@/services/auth/MockAuthService";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";

interface AuthContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  childSession: ChildSession | null;
  activeChildProfile: ChildProfile | null;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  selectChildSession: (child: ChildProfile) => void;
  clearChildSession: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [childSession, setChildSession] = useState<ChildSession | null>(null);
  const [activeChildProfile, setActiveChildProfile] = useState<ChildProfile | null>(null);

  // Select appropriate AuthService implementation
  const [authService] = useState<IAuthService>(() => {
    const userRepo = RepositoryFactory.getUserRepository();
    if (FirebaseClient.isConfigured() && process.env.USE_IN_MEMORY_REPOSITORIES !== "true") {
      return new FirebaseAuthService(userRepo);
    }
    return new MockAuthService(userRepo);
  });

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((profile) => {
      setUser(profile);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [authService]);

  const clearError = useCallback(() => setError(null), []);

  const loginWithEmail = useCallback(
    async (email: string, pass: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await authService.loginWithEmail(email, pass);
        setUser(profile);
      } catch (err: unknown) {
        const msg = FirebaseAuthService.mapAuthError(err);
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [authService]
  );

  const registerWithEmail = useCallback(
    async (email: string, pass: string, displayName: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const profile = await authService.registerWithEmail(email, pass, displayName);
        setUser(profile);
      } catch (err: unknown) {
        const msg = FirebaseAuthService.mapAuthError(err);
        setError(msg);
        throw new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [authService]
  );

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const profile = await authService.loginWithGoogle();
      setUser(profile);
    } catch (err: unknown) {
      const msg = FirebaseAuthService.mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      // Clean up in-memory child session on logout
      setChildSession(null);
      setActiveChildProfile(null);
    } catch (err: unknown) {
      const msg = FirebaseAuthService.mapAuthError(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  const resetPassword = useCallback(
    async (email: string) => {
      setError(null);
      try {
        await authService.resetPassword(email);
      } catch (err: unknown) {
        const msg = FirebaseAuthService.mapAuthError(err);
        setError(msg);
        throw new Error(msg);
      }
    },
    [authService]
  );

  const selectChildSession = useCallback((child: ChildProfile) => {
    if (!user) {
      console.warn("[AuthContext] Cannot create child session without authenticated parent.");
      return;
    }
    if (child.parentUid !== user.uid) {
      console.error("[AuthContext] Security Violation: Child does not belong to authenticated parent.");
      return;
    }

    const session: ChildSession = {
      parentUid: user.uid,
      childId: child.id,
      startedAt: new Date().toISOString(),
    };
    setChildSession(session);
    setActiveChildProfile(child);
  }, [user]);

  const clearChildSession = useCallback(() => {
    setChildSession(null);
    setActiveChildProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        childSession,
        activeChildProfile,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
        selectChildSession,
        clearChildSession,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
