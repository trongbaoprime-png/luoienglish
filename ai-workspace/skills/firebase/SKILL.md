---
name: firebase
description: Guidelines for Firebase Auth, Firestore data models, security rules, and repository adapters in LƯỜI ENGLISH.
---
# Firebase Skill for LƯỜI ENGLISH

## Rules:
- Initialize Firebase in `src/services/firebase/`.
- Repository adapters in `src/repositories/firebase/` wrap all Firestore calls.
- Enforce strict typing for Firestore documents matching `src/types/`.
- Keep Firestore collection names standardized: `users`, `children`, `curricula`, `units`, `lessons`, `knowledgeItems`, `studentProgress`, `knowledgeMastery`, `rewardLedger`, `pets`.
