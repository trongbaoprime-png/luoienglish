# LƯỜI OS — Data Migration & Schema Evolution Checklist

> **Mandatory Rule**: Use before merging any schema change, collection rename, or field addition/deprecation.  
> **Valid Answers**: `PASS` | `FAIL` | `N/A` | `UNKNOWN`  
> **CRITICAL RULE**: Any `FAIL` or security-critical `UNKNOWN` blocks migration from beginning or being marked DONE.

---

## 1. Schema Backward & Forward Compatibility
- [ ] **Dual-Read / Dual-Write**: Does the application handle documents missing the new field without crashing? (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Default Value Fallbacks**: Are domain entities populated with safe defaults when legacy documents lack newly added properties? (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Type Discriminators**: Are polymorphic documents clearly tagged with version/type discriminators (`version: number`)? (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)

## 2. Multi-Tenant Data Isolation
- [ ] **Ownership Preservation**: Does the migration maintain strict `parentUid` / `childId` foreign key bindings on all migrated documents? (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Rule Alignment**: Have Firestore security rules been updated simultaneously to cover newly created collections or fields? (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)

## 3. Rollback & Idempotency
- [ ] **Idempotent Script**: Can the migration script be executed multiple times safely without duplicating records or corrupting balances? (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Rollback Plan**: Is there an automated or manual rollback procedure documented in case migration fails mid-way? (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
- [ ] **Dry Run Executed**: Has the migration been tested on local emulator data before touching production? (Status: `PASS` / `FAIL` / `N/A` / `UNKNOWN`)
