# LƯỜI OS — Architecture Lessons Memory

> **Schema**: `ID` | `Context` | `Failure Pattern` | `Why It Failed` | `General Rule` | `Required Pattern` | `Attack/Test` | `Applies To`

---

### ARCH-001
- **ID**: `ARCH-001`
- **Context**: Repository layer adapters and database integration.
- **Failure Pattern**: Production adapter secretly delegates to an in-memory repository mock.
- **Why It Failed**: In early bootstrap or lazy refactoring, `FirestoreRepository` delegated to `InMemoryRepository` to pass tests, causing data loss on server restarts and breaking multi-instance deployments.
- **General Rule**: Production repository adapters must execute against real persistent databases (Firestore/SQL). `InMemory` adapters must remain isolated in test suites.
- **Required Pattern**: `FirestoreRepository` executes real Firestore queries and transactions with identical contracts to `InMemoryRepository`.
- **Attack/Test**: Verify persistence across repository instance re-instantiation in integration tests.
- **Applies To**: `src/repositories/firestore/*`, `RepositoryFactory.ts`.

---

### ARCH-002
- **ID**: `ARCH-002`
- **Context**: Multi-child family accounts and presentation preferences (e.g. Theme, Language).
- **Failure Pattern**: Storing child presentation preference as global `localStorage` state instead of child-scoped profile data.
- **Why It Failed**: When multiple siblings share a tablet or desktop browser, Child A changing their theme overwrote Child B's preference globally.
- **General Rule**: User/child preferences must be scoped to the specific child profile (`ChildProfile.preferences.themeId`), persisted in database, and cached locally using child-scoped keys (`luoi_theme_${childId}`).
- **Required Pattern**:
  ```typescript
  // Source of truth: Firestore Profile
  // Local cache key:
  const cacheKey = `luoi_theme_${childId}`;
  ```
- **Attack/Test**: Unit test: Child A setting "explorer" theme does not alter Child B's "cozy" theme preference in Firestore or cache.
- **Applies To**: `src/lib/theme/ThemeContext.tsx`, `ChildProfile`, all UI personalization modules.
