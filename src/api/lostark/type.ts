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
};

export type TLostarkColoredEffect = {
  text: string;
  color: string | null;
};

export type TLostarkAbilityStoneEngraving = {
  name: string;
  level: number | null;
};

export type TLostarkCharacterSummary = {
  profiles: {
    characterName: string | null;
    serverName: string | null;
    characterClassName: string | null;
    itemAvgLevel: string | null;
    combatPower: unknown;
    characterImage: string | null;
  };
  equipment: {
    gears: TLostarkGearSummaryItem[];
    accessories: TLostarkAccessorySummaryItem[];
    bracelet: TLostarkBraceletSummaryItem | null;
    abilityStone: TLostarkAbilityStoneSummaryItem | null;
  };
  engravings: TLostarkEngravingSummaryItem[];
  gems: TLostarkGemSummary;
  legendaryAvatars: TLostarkLegendaryAvatarSummaryItem[];
  arkPassive: TLostarkArkPassiveSummary;
  arkGrid: TLostarkArkGridSummary;
};

export type TLostarkGearSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  quality: number | null;
  itemLevel: string | null;
};

export type TLostarkAccessorySummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  quality: number | null;
  basicEffects: string[];
  polishEffects: TLostarkColoredEffect[];
};

export type TLostarkBraceletSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  braceletEffects: TLostarkColoredEffect[];
};

export type TLostarkAbilityStoneSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  abilityStoneBonusEffects: string[];
  abilityStoneEngravings: TLostarkAbilityStoneEngraving[];
};

export type TLostarkEngravingSummaryItem = {
  name: string | null;
  grade: string | null;
  level: number | null;
  description: string | null;
  abilityStoneLevel: number | null;
};

export type TLostarkGemEffectType = 'damage' | 'cooldown' | null;

export type TLostarkGemSummaryItem = {
  icon: string | null;
  slot: number | null;
  name: string | null;
  grade: string | null;
  level: number | null;
  kind: string | null;
  effectType: TLostarkGemEffectType;
  skillName: string | null;
  effects: string[];
  bonusEffect: string | null;
};

export type TLostarkGemSummary = {
  items: TLostarkGemSummaryItem[];
  totalBasicAttack: string | null;
};

export type TLostarkLegendaryAvatarSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
};

export type TLostarkArkPassiveSummary = {
  title: string | null;
  points: TLostarkArkPassivePoint[];
};

export type TLostarkArkPassivePoint = {
  name: string | null;
  value: number | null;
  description: string | null;
};

export type TLostarkArkGridSummary = {
  cores: TLostarkArkGridCore[];
  effects: TLostarkArkGridEffect[];
};

export type TLostarkArkGridCore = {
  icon: string | null;
  name: string | null;
  grade: string | null;
  point: number | null;
};

export type TLostarkArkGridEffect = {
  name: string | null;
  level: number | null;
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
    summary: TLostarkCharacterSummary;
    rawPayload: TLostarkCharacterRawPayload;
  };
};

export type TReqUpsertLostarkMainCharacterRow = {
  user_id: string;
  character_name: string;
  character_class: string;
  item_level: string;
  summary: TLostarkCharacterSummary;
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
  summary: TLostarkCharacterSummary;
  rawPayload: TLostarkCharacterRawPayload | null;
};
