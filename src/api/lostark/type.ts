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
    summary: unknown;
    rawPayload: Record<string, unknown>;
  };
};

export type TReqUpsertLostarkMainCharacterRow = {
  user_id: string;
  character_name: string;
  character_class: string;
  item_level: string;
  summary: unknown;
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
