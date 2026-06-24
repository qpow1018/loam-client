export type TClearGoldGate = {
  name: string;
  tradableGold: number;
  boundGold: number;
};

export type TClearGoldDifficulty = {
  id: string;
  name: string;
  entryItemLevel: number;
  updatedAt: string;
  gates: readonly TClearGoldGate[];
};

export type TClearGoldContent = {
  id: string;
  name: string;
  difficulties: readonly TClearGoldDifficulty[];
};

export type TClearGoldSummary = {
  tradableGold: number;
  boundGold: number;
  totalGold: number;
};
