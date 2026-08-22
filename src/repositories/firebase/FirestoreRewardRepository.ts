import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import { RewardBalance, RewardTransaction } from "@/types/reward";
import { MotivationEvent, LevelTransition } from "@/types/motivation";
import {
  IRewardRepository,
  MotivationEventContext,
  RecordTransactionResult,
} from "../interfaces/IRewardRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";
import { RewardEngine } from "@/engines/reward/RewardEngine";

export class FirestoreRewardRepository implements IRewardRepository {
  private balancesCol = "rewardBalances";
  private transactionsCol = "rewardTransactions";
  private outboxCol = "motivationEvents";

  public async getBalance(childId: string): Promise<RewardBalance> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.balancesCol, childId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return snap.data() as RewardBalance;
    }

    const initial: RewardBalance = {
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
    return initial;
  }

  /**
   * Atomically records reward transaction, balance, and motivation event (outbox) in a single Firestore transaction.
   */
  public async recordTransaction(
    tx: RewardTransaction,
    motivationEventContext?: MotivationEventContext
  ): Promise<RecordTransactionResult> {
    const db = FirebaseClient.getDb();
    const txDocRef = doc(db, this.transactionsCol, tx.idempotencyKey);
    const balanceDocRef = doc(db, this.balancesCol, tx.childId);
    const outboxDocRef = doc(db, this.outboxCol, tx.idempotencyKey);

    return await runTransaction(db, async (transaction) => {
      // 1. Check if transaction has already been processed
      const existingTxSnap = await transaction.get(txDocRef);
      if (existingTxSnap.exists()) {
        const balanceSnap = await transaction.get(balanceDocRef);
        const currentBalance = balanceSnap.exists()
          ? (balanceSnap.data() as RewardBalance)
          : await this.getBalance(tx.childId);

        const outboxSnap = await transaction.get(outboxDocRef);
        const existingEvent: MotivationEvent = outboxSnap.exists()
          ? (outboxSnap.data() as MotivationEvent)
          : {
              id: `motevt_${tx.idempotencyKey}`,
              childId: tx.childId,
              idempotencyKey: tx.idempotencyKey,
              rewardTransactionId: tx.id,
              eventType: tx.triggerEvent,
              occurredAt: tx.createdAt,
              payload: {
                starsDelta: tx.starsDelta,
                xpDelta: tx.xpDelta,
                petFoodDelta: tx.petFoodDelta,
                levelTransition: {
                  previousLevel: currentBalance.level,
                  newLevel: currentBalance.level,
                  isLevelUp: false,
                },
              },
              policyVersion: tx.policyVersion || "2.0.0",
              processingState: "PROCESSED",
              processedProjections: [],
              updatedAt: tx.createdAt,
            };

        return {
          transaction: existingTxSnap.data() as RewardTransaction,
          balance: currentBalance,
          motivationEvent: existingEvent,
          levelTransition: existingEvent.payload.levelTransition,
          isNew: false,
        };
      }

      // 2. Read current balance & calculate transition
      const balanceSnap = await transaction.get(balanceDocRef);
      const currentBalance: RewardBalance = balanceSnap.exists()
        ? (balanceSnap.data() as RewardBalance)
        : {
            childId: tx.childId,
            totalStars: 0,
            totalXp: 0,
            totalCoins: 0,
            totalPetFood: 0,
            level: 1,
            currentStreakDays: 0,
            longestStreakDays: 0,
            updatedAt: new Date().toISOString(),
          };

      const previousLevel = currentBalance.level;
      const updatedBalance = RewardEngine.applyTransaction(currentBalance, tx);
      const newLevel = updatedBalance.level;
      const isLevelUp = newLevel > previousLevel;

      const levelTransition: LevelTransition = {
        previousLevel,
        newLevel,
        isLevelUp,
      };

      // 3. Construct MotivationEvent
      const motivationEvent: MotivationEvent = {
        id: `motevt_${tx.idempotencyKey}`,
        childId: tx.childId,
        idempotencyKey: tx.idempotencyKey,
        rewardTransactionId: tx.id,
        eventType: tx.triggerEvent,
        skill: motivationEventContext?.skill,
        learningEvidenceId: tx.learningEvidenceId,
        sourceEntityId: tx.sourceEntityId,
        occurredAt: tx.createdAt,
        payload: {
          ...motivationEventContext?.payload,
          starsDelta: tx.starsDelta,
          xpDelta: tx.xpDelta,
          petFoodDelta: tx.petFoodDelta,
          levelTransition,
        },
        policyVersion: tx.policyVersion || "2.0.0",
        processingState: "PENDING",
        processedProjections: [],
        updatedAt: new Date().toISOString(),
      };

      // 4. Commit atomic writes across Ledger + Balance + Outbox
      transaction.set(txDocRef, tx);
      transaction.set(balanceDocRef, updatedBalance, { merge: true });
      transaction.set(outboxDocRef, motivationEvent);

      return {
        transaction: tx,
        balance: updatedBalance,
        motivationEvent,
        levelTransition,
        isNew: true,
      };
    });
  }

  public async getTransactionHistory(childId: string, limitCount = 20): Promise<RewardTransaction[]> {
    const db = FirebaseClient.getDb();
    const q = query(
      collection(db, this.transactionsCol),
      where("childId", "==", childId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    const list: RewardTransaction[] = [];
    snap.forEach((d) => list.push(d.data() as RewardTransaction));
    return list;
  }

  public async isIdempotencyKeyProcessed(idempotencyKey: string): Promise<boolean> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.transactionsCol, idempotencyKey);
    const snap = await getDoc(docRef);
    return snap.exists();
  }

  public async getMotivationEvent(idempotencyKey: string): Promise<MotivationEvent | null> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.outboxCol, idempotencyKey);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as MotivationEvent;
  }

  public async getUnprocessedMotivationEvents(childId?: string): Promise<MotivationEvent[]> {
    const db = FirebaseClient.getDb();
    let q = query(collection(db, this.outboxCol), where("processingState", "==", "PENDING"));
    if (childId) {
      q = query(q, where("childId", "==", childId));
    }
    const snap = await getDocs(q);
    const list: MotivationEvent[] = [];
    snap.forEach((d) => list.push(d.data() as MotivationEvent));
    return list;
  }

  public async saveMotivationEvent(event: MotivationEvent): Promise<MotivationEvent> {
    const db = FirebaseClient.getDb();
    const docRef = doc(db, this.outboxCol, event.idempotencyKey);
    await setDoc(docRef, event, { merge: true });
    return event;
  }
}
