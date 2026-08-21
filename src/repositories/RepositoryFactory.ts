import { FirebaseClient } from "@/services/firebase/FirebaseClient";
import { IChildRepository } from "./interfaces/IChildRepository";
import { ICurriculumRepository } from "./interfaces/ICurriculumRepository";
import { IProgressRepository } from "./interfaces/IProgressRepository";
import { IRewardRepository } from "./interfaces/IRewardRepository";
import { IMemoryRepository } from "./interfaces/IMemoryRepository";
import { IPetRepository } from "./interfaces/IPetRepository";

import { FirestoreChildRepository } from "./firebase/FirestoreChildRepository";
import { FirestoreCurriculumRepository } from "./firebase/FirestoreCurriculumRepository";
import { FirestoreProgressRepository } from "./firebase/FirestoreProgressRepository";
import { FirestoreRewardRepository } from "./firebase/FirestoreRewardRepository";
import { FirestoreMemoryRepository } from "./firebase/FirestoreMemoryRepository";
import { FirestorePetRepository } from "./firebase/FirestorePetRepository";

import { InMemoryChildRepository } from "./memory/InMemoryChildRepository";
import { InMemoryCurriculumRepository } from "./memory/InMemoryCurriculumRepository";
import { InMemoryProgressRepository } from "./memory/InMemoryProgressRepository";
import { InMemoryRewardRepository } from "./memory/InMemoryRewardRepository";
import { InMemoryMemoryRepository } from "./memory/InMemoryMemoryRepository";
import { InMemoryPetRepository } from "./memory/InMemoryPetRepository";

export class RepositoryFactory {
  private static useInMemory(): boolean {
    if (process.env.USE_IN_MEMORY_REPOSITORIES === "true") {
      return true;
    }
    // If not in browser and no firebase credentials, fallback in test/dev
    return !FirebaseClient.isConfigured();
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
}
