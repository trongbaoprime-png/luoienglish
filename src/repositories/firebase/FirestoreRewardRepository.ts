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
} from "firebase/firestore";
import { RewardBalance, RewardTransaction } from "@/types/reward";
import { IRewardRepository } from "../interfaces/IRewardRepository";
import { FirebaseClient } from "@/services/firebase/FirebaseClient";
import { RewardEngine } from "@/engines/reward/RewardEngine";

export class FirestoreRewardRepository implements IRewardRepository {
  private balancesCol = "rewardBalances";
  private transactionsCol = "rewardTransactions";

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
      updatedAt: new Date().toISOString(),
    };
    return initial;
  }

  /**
   * Atomically records reward transaction and updates child balance in a single Firestore transaction
   * Guarantees strict idempotency and eliminates concurrent race conditions.
   */
  public async recordTransaction(tx: RewardTransaction): Promise<RewardTransaction> {
    const db = FirebaseClient.getDb();
    const txDocRef = doc(db, this.transactionsCol, tx.idempotencyKey);
    const balanceDocRef = doc(db, this.balancesCol, tx.childId);

    return await runTransaction(db, async (transaction) => {
      // 1. Check if transaction has already been processed
      const existingTxSnap = await transaction.get(txDocRef);
      if (existingTxSnap.exists()) {
        return existingTxSnap.data() as RewardTransaction;
      }

      // 2. Read current balance
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
            updatedAt: new Date().toISOString(),
          };

      // 3. Apply transaction deltas
      const updatedBalance = RewardEngine.applyTransaction(currentBalance, tx);

      // 4. Commit atomic writes
      transaction.set(txDocRef, tx);
      transaction.set(balanceDocRef, updatedBalance, { merge: true });

      return tx;
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
}
