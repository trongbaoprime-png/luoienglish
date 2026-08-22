import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import {
  FeedPetResult,
  PetInteractionResult,
  PetInteractionTransaction,
  PetProfile,
} from "@/types/pet";
import { RewardBalance, RewardTransaction } from "@/types/reward";
import {
  IPetRepository,
  RecordFeedParams,
  RecordInteractionParams,
} from "../interfaces/IPetRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";
import { HungerPolicy } from "@/domain/pet/HungerPolicy";
import { BondPolicy } from "@/domain/pet/BondPolicy";
import { GrowthPolicy } from "@/domain/pet/GrowthPolicy";
import { PetReactionEngine } from "@/domain/pet/PetReactionEngine";

export class FirestorePetRepository implements IPetRepository {
  private collectionName = "pets";
  private balancesCol = "rewardBalances";
  private txCol = "rewardTransactions";
  private interactionsCol = "petInteractions";

  public async findByChildId(childId: string): Promise<PetProfile | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, childId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as PetProfile;
  }

  public async create(pet: PetProfile): Promise<PetProfile> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, pet.childId);
    await setDoc(docRef, pet);
    return pet;
  }

  public async update(id: string, updates: Partial<PetProfile>): Promise<PetProfile> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    const updated = await this.findByChildId(id);
    if (!updated) throw new Error(`Pet not found after update: ${id}`);
    return updated;
  }

  public async getInteraction(idempotencyKey: string): Promise<PetInteractionTransaction | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.interactionsCol, idempotencyKey);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as PetInteractionTransaction;
  }

  /**
   * Atomically executes feed transaction inside a single Firestore transaction:
   * 1. Reads idempotency interaction
   * 2. Reads RewardBalance
   * 3. Reads PetProfile
   * 4. Validates food balance
   * 5. Mutates RewardBalance, PetProfile, and writes PetInteractionTransaction
   */
  public async recordFeedTransaction(params: RecordFeedParams): Promise<FeedPetResult> {
    const db = FirebaseClient.getDb();
    const { childId, foodAmount, idempotencyKey } = params;

    const interactionDocRef = doc(db, this.interactionsCol, idempotencyKey);
    const balanceDocRef = doc(db, this.balancesCol, childId);
    const petDocRef = doc(db, this.collectionName, childId);
    const rewardTxDocRef = doc(db, this.txCol, `feed_reward_${idempotencyKey}`);

    return await runTransaction(db, async (transaction) => {
      // 1. Check idempotency
      const intSnap = await transaction.get(interactionDocRef);
      const balanceSnap = await transaction.get(balanceDocRef);
      const petSnap = await transaction.get(petDocRef);

      let balance: RewardBalance = balanceSnap.exists()
        ? (balanceSnap.data() as RewardBalance)
        : {
            childId,
            totalStars: 0,
            totalXp: 0,
            totalCoins: 0,
            totalPetFood: 0,
            level: 1,
            currentStreakDays: 0,
            longestStreakDays: 0,
            updatedAt: new Date().toISOString(),
          };

      let pet: PetProfile = petSnap.exists()
        ? (petSnap.data() as PetProfile)
        : {
            id: `pet_${childId}`,
            childId,
            name: "Chú Lười",
            species: "sloth",
            visualVariant: "default",
            level: 1,
            xp: 0,
            stats: { hunger: 50, happiness: 70, energy: 80, bond: 10 },
            growthStage: "baby",
            equippedCosmetics: {},
            discoveredAnimations: ["IDLE_BREATHE", "EAT", "HAPPY_BOUNCE"],
            version: 1,
            lastFedAt: new Date().toISOString(),
            lastInteractedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

      if (intSnap.exists()) {
        const reaction = PetReactionEngine.fromInteraction("FEED", pet);
        return {
          pet,
          reaction,
          foodRemaining: balance.totalPetFood,
          isNew: false,
        };
      }

      // 2. Validate sufficient food balance
      if (balance.totalPetFood < foodAmount) {
        throw new Error(
          `Insufficient PetFood balance. Required: ${foodAmount}, Available: ${balance.totalPetFood}`
        );
      }

      // 3. Deduct PetFood
      balance = {
        ...balance,
        totalPetFood: balance.totalPetFood - foodAmount,
        updatedAt: new Date().toISOString(),
      };
      transaction.set(balanceDocRef, balance, { merge: true });

      const feedRewardTx: RewardTransaction = {
        id: `tx_feed_${idempotencyKey}`,
        childId,
        idempotencyKey: `feed_reward_${idempotencyKey}`,
        triggerEvent: "pet_nurtured",
        starsDelta: 0,
        xpDelta: 0,
        coinsDelta: 0,
        petFoodDelta: -foodAmount,
        reason: `Cho Chú Lười ăn (${foodAmount} thức ăn)`,
        createdAt: new Date().toISOString(),
      };
      transaction.set(rewardTxDocRef, feedRewardTx);

      // 4. Mutate Pet stats & growth stage
      const beforeVersion = pet.version;
      const newHunger = HungerPolicy.feed(pet.stats.hunger, foodAmount);
      const newHappiness = Math.min(100, pet.stats.happiness + HungerPolicy.FEED_HAPPINESS_GAIN);
      const newEnergy = Math.min(100, pet.stats.energy + HungerPolicy.FEED_ENERGY_GAIN);
      const newBond = Math.min(100, pet.stats.bond + BondPolicy.getFeedBondGain());
      const newXp = pet.xp + HungerPolicy.FEED_XP_GAIN * foodAmount;
      const newGrowthStage = GrowthPolicy.calculateGrowthStage(newXp, newBond);

      pet = {
        ...pet,
        xp: newXp,
        stats: {
          ...pet.stats,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          bond: newBond,
        },
        growthStage: newGrowthStage,
        version: beforeVersion + 1,
        lastFedAt: new Date().toISOString(),
        lastInteractedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      transaction.set(petDocRef, pet, { merge: true });

      // 5. Write PetInteraction transaction
      const interactionTx: PetInteractionTransaction = {
        id: `pet_int_${idempotencyKey}`,
        childId,
        petId: pet.id,
        interactionType: "FEED",
        petFoodDelta: -foodAmount,
        beforeVersion,
        afterVersion: pet.version,
        idempotencyKey,
        createdAt: new Date().toISOString(),
      };
      transaction.set(interactionDocRef, interactionTx);

      const reaction = PetReactionEngine.fromInteraction("FEED", pet);

      return {
        pet,
        reaction,
        foodRemaining: balance.totalPetFood,
        isNew: true,
      };
    });
  }

  /**
   * Atomically executes interaction transaction
   */
  public async recordInteractionTransaction(
    params: RecordInteractionParams
  ): Promise<PetInteractionResult> {
    const db = FirebaseClient.getDb();
    const { childId, interactionType, idempotencyKey } = params;

    const interactionDocRef = doc(db, this.interactionsCol, idempotencyKey);
    const petDocRef = doc(db, this.collectionName, childId);

    return await runTransaction(db, async (transaction) => {
      const intSnap = await transaction.get(interactionDocRef);
      const petSnap = await transaction.get(petDocRef);

      let pet: PetProfile = petSnap.exists()
        ? (petSnap.data() as PetProfile)
        : {
            id: `pet_${childId}`,
            childId,
            name: "Chú Lười",
            species: "sloth",
            visualVariant: "default",
            level: 1,
            xp: 0,
            stats: { hunger: 50, happiness: 70, energy: 80, bond: 10 },
            growthStage: "baby",
            equippedCosmetics: {},
            discoveredAnimations: ["IDLE_BREATHE", "EAT", "HAPPY_BOUNCE"],
            version: 1,
            lastFedAt: new Date().toISOString(),
            lastInteractedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

      if (intSnap.exists()) {
        const reaction = PetReactionEngine.fromInteraction(interactionType, pet);
        return {
          pet,
          reaction,
          isNew: false,
        };
      }

      const beforeVersion = pet.version;
      let happinessGain = 0;
      let bondGain = 0;

      if (interactionType === "PET") {
        happinessGain = 5;
        bondGain = BondPolicy.getPetBondGain();
      } else if (interactionType === "PLAY_SHORT") {
        happinessGain = 10;
        bondGain = 1;
      }

      const newHappiness = Math.min(100, pet.stats.happiness + happinessGain);
      const newBond = Math.min(100, pet.stats.bond + bondGain);
      const newGrowthStage = GrowthPolicy.calculateGrowthStage(pet.xp, newBond);

      pet = {
        ...pet,
        stats: {
          ...pet.stats,
          happiness: newHappiness,
          bond: newBond,
        },
        growthStage: newGrowthStage,
        version: beforeVersion + 1,
        lastInteractedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      transaction.set(petDocRef, pet, { merge: true });

      const interactionTx: PetInteractionTransaction = {
        id: `pet_int_${idempotencyKey}`,
        childId,
        petId: pet.id,
        interactionType,
        petFoodDelta: 0,
        beforeVersion,
        afterVersion: pet.version,
        idempotencyKey,
        createdAt: new Date().toISOString(),
      };
      transaction.set(interactionDocRef, interactionTx);

      const reaction = PetReactionEngine.fromInteraction(interactionType, pet);

      return {
        pet,
        reaction,
        isNew: true,
        happinessGain,
        bondGain,
      };
    });
  }
}
