export type TResLostarkMyCharacterRow = {
  id: string;
  user_id: string;
  nickname: string;
  class_name: string;
  item_level: string;
  is_main: boolean;
  sort_order: number;
};

export type TResLostarkMyCharacter = {
  id: string;
  nickname: string;
  className: string;
  itemLevel: string;
  isMain?: boolean;
};

export type TReqCreateLostarkMyCharacterRow = Omit<TResLostarkMyCharacterRow, 'id'> & {
  id?: string;
};

export type TReqCreateLostarkMyCharacter = Omit<TResLostarkMyCharacter, 'id' | 'isMain'>;

export type TResLostarkSiblingCharacters = {
  ok?: boolean;
  status?: number;
  data: TResLostarkSiblingCharacter[];
};

export type TResLostarkSiblingCharacter = {
  ServerName: string;
  CharacterName: string;
  CharacterLevel: number;
  CharacterClassName: string;
  ItemAvgLevel: string;
};

export type TReqLostarkCharacterDetails = {
  characterName: string;
  debug?: boolean;
};

export type TResLostarkCharacterDetails = {
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

export type TReqUpsertLostarkMainCharacterRow = {
  user_id: string;
  character_name: string;
  character_class: string;
  item_level: string;
  summary: TCharacterSpecSummary;
  raw_payload: Record<string, unknown> | null;
};

export type TResLostarkMainCharacterRow = TReqUpsertLostarkMainCharacterRow & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type TResLostarkMainCharacter = {
  id: string;
  characterName: string;
  characterClass: string;
  itemLevel: string;
};

// TODO check
export type TReqMainCharacterSpecs = {
  anonymousClientId: string;
  characterNames: string[];
};

export type TResMainCharacterSpecs = {
  ok: boolean;
  data: TCharacterSpec[];
};

export type TReqSaveMainCharacterSpec = {
  anonymousClientId: string;
  spec: TCharacterSpec;
};

export type TResSaveMainCharacterSpec = {
  ok: boolean;
  data: TCharacterSpec;
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

export type TCharacterSpecGemSummary = {
  items: unknown[];
  totalBasicAttack: string | null;
};

export type TCharacterSpecSectionStatus = Record<string, TCharacterSpecSectionStatusValue>;

export type TCharacterSpecSectionStatusValue = 'success' | 'failed' | 'empty' | 'needsReview';
