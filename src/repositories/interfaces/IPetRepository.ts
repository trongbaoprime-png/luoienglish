import {
  FeedPetResult,
  PetInteractionResult,
  PetInteractionTransaction,
  PetInteractionType,
  PetProfile,
} from "@/types/pet";

export interface RecordFeedParams {
  childId: string;
  petId: string;
  foodAmount: number;
  idempotencyKey: string;
}

export interface RecordInteractionParams {
  childId: string;
  petId: string;
  interactionType: PetInteractionType;
  idempotencyKey: string;
}

export interface IPetRepository {
  findByChildId(childId: string): Promise<PetProfile | null>;
  create(pet: PetProfile): Promise<PetProfile>;
  update(id: string, updates: Partial<PetProfile>): Promise<PetProfile>;
  getInteraction(idempotencyKey: string): Promise<PetInteractionTransaction | null>;
  recordFeedTransaction(params: RecordFeedParams): Promise<FeedPetResult>;
  recordInteractionTransaction(params: RecordInteractionParams): Promise<PetInteractionResult>;
}
