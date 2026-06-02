export type TResLostarkSiblingCharacters = {
  ok?: boolean;
  status?: number;
  data: TLostarkSiblingCharacter[];
};

export type TLostarkSiblingCharacter = {
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
};

export type TReqLostarkCharacterSpec = {
  characterName: string;
  debug?: boolean;
};

export type TCharacterSpecSectionStatusValue = 'success' | 'failed' | 'empty' | 'needsReview';

export type TCharacterSpecSectionStatus = Record<string, TCharacterSpecSectionStatusValue>;

export type TCharacterSpecGemSummary = {
  items: unknown[];
  totalBasicAttack: string | null;
};

export type TCharacterSpecSummary = {
  profile: Record<string, unknown>;
  equipment: unknown[];
  accessories: unknown[];
  bracelet: Record<string, unknown> | null;
  abilityStone: Record<string, unknown> | null;
  engravings: unknown[];
  gems: TCharacterSpecGemSummary | unknown[];
  legendaryAvatars: unknown[];
  needsReview: string[];
};

export type TCharacterSpec = {
  characterName: string;
  serverName: string | null;
  characterClass: string | null;
  itemLevel: string | null;
  summary: TCharacterSpecSummary;
  rawPayload: Record<string, unknown>;
  sectionStatus: TCharacterSpecSectionStatus;
  savedAt: string | null;
  updatedAt: string | null;
};

export type TResLostarkCharacterSpec = {
  ok: boolean;
  status: number;
  data: {
    characterName: string;
    serverName: string | null;
    characterClass: string | null;
    itemLevel: string | null;
    summary: TCharacterSpecSummary;
    rawPayload: Record<string, unknown>;
    sectionStatus: TCharacterSpecSectionStatus;
  };
};

export type TReqMainCharacterSpecs = {
  anonymousClientId: string;
  characterNames: string[];
};

export type TReqSaveMainCharacterSpec = {
  anonymousClientId: string;
  spec: TCharacterSpec;
};

export type TResMainCharacterSpecs = {
  ok: boolean;
  data: TCharacterSpec[];
};

export type TResSaveMainCharacterSpec = {
  ok: boolean;
  data: TCharacterSpec;
};
