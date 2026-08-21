/**
 * Authentication, Parent Mode Session, and Parental Gate Domain Types
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
  securityVersion?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChildSession {
  parentUid: string;
  childId: string;
  startedAt: string;
}

export interface ParentModeSession {
  sessionId: string;
  parentUid: string;
  securityVersion: number;
  createdAt: string;
  expiresAt: string;
}

export interface PinRecord {
  parentUid: string;
  pinHash: string;
  salt: string;
  version: number;
  algo: string;
  iterations: number;
  securityVersion: number;
  failedAttempts: number;
  lockedUntil?: string;
  updatedAt: string;
}

export interface PinVerificationResult {
  success: boolean;
  isLocked: boolean;
  lockedUntil?: string;
  attemptsRemaining?: number;
  parentModeSessionToken?: string;
  message: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}
