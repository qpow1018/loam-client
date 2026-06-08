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

export type TLostarkCharacterRawPayload = Record<string, unknown>;

export type TResLostarkCharacterDetails = {
  ok: boolean;
  status: number;
  data: {
    characterName: string;
    serverName: string | null;
    characterClass: string | null;
    itemLevel: string | null;
    summary: TResLostarkCharacterSummary;
    rawPayload: TLostarkCharacterRawPayload;
  };
};

export type TReqUpsertLostarkMainCharacterRow = {
  user_id: string;
  character_name: string;
  character_class: string;
  item_level: string;
  sort_order: number;
  summary: TResLostarkCharacterSummary;
  raw_payload: TLostarkCharacterRawPayload | null;
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
  sortOrder: number;
  summary: TResLostarkCharacterSummary;
  rawPayload: TLostarkCharacterRawPayload | null;
};

export type TResLostarkCharacterSummary = {
  profiles: {
    characterName: string | null;
    serverName: string | null;
    characterClassName: string | null;
    itemAvgLevel: string | null;
    combatPower: string | null;
    characterImage: string | null;
  };
  equipment: {
    gears: TLostarkGear[];
    accessories: TLostarkAccessory[];
    bracelet: TLostarkBracelet | null;
    abilityStone: TLostarkAbilityStone | null;
  };
  engravings: TLostarkEngraving[];
  gems: TLostarkGem[];
  arkPassive: TLostarkArkPassive;
  arkGrid: TLostarkArkGrid;
  legendaryAvatars: TLostarkLegendaryAvatar[];
};

export type TLostarkColoredEffect = {
  text: string;
  color: string | null;
};

export type TLostarkGear = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  quality: number | null;
  itemLevel: string | null;
  enhancement: number | null;
};

export type TLostarkAccessory = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  quality: number | null;
  basicEffects: string[];
  polishEffects: TLostarkColoredEffect[];
};

export type TLostarkBracelet = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  braceletEffects: TLostarkColoredEffect[];
};

export type TLostarkAbilityStone = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  abilityStoneBonusEffects: string[];
  abilityStoneEngravings: {
    name: string;
    level: number | null;
  }[];
};

export type TLostarkEngraving = {
  name: string | null;
  grade: string | null;
  level: number | null;
  description: string | null;
  abilityStoneLevel: number | null;
};

export type TLostarkGem = {
  icon: string | null;
  slot: number | null;
  name: string | null;
  grade: string | null;
  level: number | null;
  kind: string | null;
  effectType: 'damage' | 'cooldown' | null;
  skillName: string | null;
  effects: string[];
  bonusEffect: string | null;
};

export type TLostarkArkPassive = {
  title: string | null;
  points: {
    name: string | null;
    value: number | null;
    description: string | null;
  }[];
};

export type TLostarkArkGrid = {
  cores: {
    icon: string | null;
    name: string | null;
    grade: string | null;
    point: number | null;
  }[];
  effects: {
    name: string | null;
    level: number | null;
  }[];
};

export type TLostarkLegendaryAvatar = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
};
