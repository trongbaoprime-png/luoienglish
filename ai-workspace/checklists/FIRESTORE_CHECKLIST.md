# LƯỜI ENGLISH — Firestore Security Rules Checklist

> **Mandatory Gate**: Use before modifying `firestore.rules` or repository queries.

---

## 1. Multi-Tenant Child Scoping
- [ ] Every child-owned collection (`studentProgress`, `knowledgeMastery`, `pets`, `rewardBalances`, `rewardTransactions`) gates access with `isParentOfChild(childId)`.
- [ ] No authenticated parent can read or write documents belonging to other parents' children.
- [ ] Unauthenticated clients are rejected 100% on private collections.

## 2. Immutable Ownership Fields on Update
- [ ] `children/{childId}`: `parentUid` is immutable on update.
- [ ] `studentProgress/{progressId}`: `childId` is immutable on update.
- [ ] `knowledgeMastery/{masteryId}`: `studentId` is immutable on update.
- [ ] `pets/{petId}`: `childId` is immutable on update.

## 3. Privilege Escalation & Direct Write Prohibition
- [ ] `users/{uid}`: `role` is immutable on update (clients cannot promote themselves to `admin`).
- [ ] `rewardBalances/{balanceId}`: `allow write: if false;` (server/admin SDK only).
- [ ] `rewardTransactions/{txId}`: `allow write: if false;` (server/admin SDK only).
- [ ] `curriculumUnits` & `curriculumLessons`: Published content is read-only for students; write requires `isAdmin()`.
