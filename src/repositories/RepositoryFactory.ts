import { FirebaseClient } from "@/services/firebase/FirebaseClient";
import { IUserRepository } from "./interfaces/IUserRepository";
import { IChildRepository } from "./interfaces/IChildRepository";
import { ICurriculumRepository } from "./interfaces/ICurriculumRepository";
import { IProgressRepository } from "./interfaces/IProgressRepository";
import { IRewardRepository } from "./interfaces/IRewardRepository";
import { IMemoryRepository } from "./interfaces/IMemoryRepository";
import { IPetRepository } from "./interfaces/IPetRepository";
import { ILearningSessionRepository } from "./interfaces/ILearningSessionRepository";
import { IReviewSessionRepository } from "./interfaces/IReviewSessionRepository";

import { FirestoreUserRepository } from "./firebase/FirestoreUserRepository";
import { FirestoreChildRepository } from "./firebase/FirestoreChildRepository";
import { FirestoreCurriculumRepository } from "./firebase/FirestoreCurriculumRepository";
import { FirestoreProgressRepository } from "./firebase/FirestoreProgressRepository";
import { FirestoreRewardRepository } from "./firebase/FirestoreRewardRepository";
import { FirestoreMemoryRepository } from "./firebase/FirestoreMemoryRepository";
import { FirestorePetRepository } from "./firebase/FirestorePetRepository";
import { FirestoreLearningSessionRepository } from "./firebase/FirestoreLearningSessionRepository";
import { FirestoreReviewSessionRepository } from "./firebase/FirestoreReviewSessionRepository";

import { InMemoryUserRepository } from "./memory/InMemoryUserRepository";
import { InMemoryChildRepository } from "./memory/InMemoryChildRepository";
import { InMemoryCurriculumRepository } from "./memory/InMemoryCurriculumRepository";
import { InMemoryProgressRepository } from "./memory/InMemoryProgressRepository";
import { InMemoryRewardRepository } from "./memory/InMemoryRewardRepository";
import { InMemoryMemoryRepository } from "./memory/InMemoryMemoryRepository";
import { InMemoryPetRepository } from "./memory/InMemoryPetRepository";
import { InMemoryLearningSessionRepository } from "./memory/InMemoryLearningSessionRepository";
import { InMemoryReviewSessionRepository } from "./memory/InMemoryReviewSessionRepository";

export class RepositoryFactory {
  /**
   * Evaluates whether to use InMemory repositories.
   * STRICT GUARD: In production runtime environments, never silently fallback to InMemory.
   */
  public static useInMemory(): boolean {
    if (process.env.USE_IN_MEMORY_REPOSITORIES === "true") {
      return true;
    }

    // In Next.js SSG / build phase where credentials are not present during static site generation
    if (
      process.env.NEXT_PHASE === "phase-production-build" ||
      process.env.npm_lifecycle_event === "build"
    ) {
      return !FirebaseClient.isConfigured();
    }

    if (process.env.NODE_ENV === "production") {
      if (!FirebaseClient.isConfigured()) {
        throw new Error(
          "[RepositoryFactory] FATAL: Production environment detected with unconfigured Firebase credentials. Silent fallback to InMemory repositories is strictly forbidden in production."
        );
      }
      return false;
    }

    // In local development or test mode, fallback to InMemory if Firebase credentials are not provided
    return !FirebaseClient.isConfigured();
  }

  public static getUserRepository(): IUserRepository {
    return this.useInMemory() ? new InMemoryUserRepository() : new FirestoreUserRepository();
  }

  public static getChildRepository(): IChildRepository {
    return this.useInMemory() ? new InMemoryChildRepository() : new FirestoreChildRepository();
  }

  public static getCurriculumRepository(): ICurriculumRepository {
    return this.useInMemory() ? new InMemoryCurriculumRepository() : new FirestoreCurriculumRepository();
  }

  public static getProgressRepository(): IProgressRepository {
    return this.useInMemory() ? new InMemoryProgressRepository() : new FirestoreProgressRepository();
  }

  public static getRewardRepository(): IRewardRepository {
    return this.useInMemory() ? new InMemoryRewardRepository() : new FirestoreRewardRepository();
  }

  public static getMemoryRepository(): IMemoryRepository {
    return this.useInMemory() ? new InMemoryMemoryRepository() : new FirestoreMemoryRepository();
  }

  public static getPetRepository(): IPetRepository {
    return this.useInMemory() ? new InMemoryPetRepository() : new FirestorePetRepository();
  }

  public static getLearningSessionRepository(): ILearningSessionRepository {
    return this.useInMemory()
      ? new InMemoryLearningSessionRepository()
      : new FirestoreLearningSessionRepository();
  }

  public static getReviewSessionRepository(): IReviewSessionRepository {
    return this.useInMemory()
      ? new InMemoryReviewSessionRepository()
      : new FirestoreReviewSessionRepository();
  }
}
