/**
 * Authentication and Parental Gate Domain Types
 */

export type UserRole = "parent" | "admin";

export interface UserPreferences {
  language: "vi" | "en";
  notifications: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  preferences: UserPreferences;
  isPinSet: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChildSession {
  parentUid: string;
  childId: string;
  startedAt: string;
}

export interface PinRecord {
  parentUid: string;
  pinHash: string;
  salt: string;
  failedAttempts: number;
  lockedUntil?: string;
  updatedAt: string;
}

export interface PinVerificationResult {
  success: boolean;
  isLocked: boolean;
  lockedUntil?: string;
  attemptsRemaining?: number;
  message: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
