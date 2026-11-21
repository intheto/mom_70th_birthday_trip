export type MutationResult = { error: string; saved: boolean };
export type PreparationComment = { id: string; topic: string; author: string; body: string; createdAt: string };
export type PreparationSnapshot = {
  canEditShared: boolean;
  familyLabel: string;
  shared: Record<string, boolean>;
  family: Record<string, boolean>;
  personal: Record<string, boolean>;
  comments: PreparationComment[];
};
