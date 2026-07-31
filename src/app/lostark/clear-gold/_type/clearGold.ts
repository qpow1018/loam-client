export type TClearGoldGate = {
  name: string;
  tradableGold: number;
  boundGold: number;
};

export type TClearGoldDifficultyTone = 'normal' | 'hard' | 'nightmare';
export type TLevelGoldStatus = 'non-preferred' | 'excluded';

export type TClearGoldDifficulty = {
  id: string;
  name: string;
  tone: TClearGoldDifficultyTone;
  levelGoldStatus?: TLevelGoldStatus;
  entryItemLevel: number;
  updatedAt: string;
  gates: readonly TClearGoldGate[];
};

export type TClearGoldContent = {
  id: string;
  name: string;
  difficulties: readonly TClearGoldDifficulty[];
};

export type TClearGoldCategory = {
  id: string;
  name: string;
  contents: readonly TClearGoldContent[];
};

export type TClearGoldSummary = {
  tradableGold: number;
  boundGold: number;
  totalGold: number;
};

export type TLevelGoldRaid = {
  contentId: string;
  contentName: string;
  difficultyId: string;
  difficultyName: string;
  entryItemLevel: number;
  tradableGold: number;
  boundGold: number;
  totalGold: number;
};

export type TLevelGoldRaidGroup = {
  raids: TLevelGoldRaid[];
  totalGold: number;
};

export type TLevelGoldRow = {
  level: number;
  withBound: TLevelGoldRaidGroup;
  withoutBound: TLevelGoldRaidGroup;
};

export type TCreateLevelGoldRowsOptions = {
  includeNonPreferred?: boolean;
};
