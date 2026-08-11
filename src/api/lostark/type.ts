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

export type TLostarkManualMetrics = {
  lopecScore: number | null;
  braceletScore: number | null;
  gemConversionLevel: number | null;
};

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
  manual_metrics: TLostarkManualMetrics | null;
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
  manualMetrics: TLostarkManualMetrics;
};

export type TResLostarkCharacterSummary = {
  profiles: {
    characterName: string | null;
    serverName: string | null;
    characterClassName: string | null;
    itemAvgLevel: string | null;
    combatPower: string | null;
    characterImage: string | null;
    stats: TLostarkCharacterStat[];
    skillPoints: {
      using: number | null;
      total: number | null;
    };
  };
  equipment: {
    gears: TLostarkGear[];
    accessories: TLostarkAccessory[];
    bracelet: TLostarkBracelet | null;
    abilityStone: TLostarkAbilityStone | null;
    orb: TLostarkOrb | null;
  };
  engravings: TLostarkEngraving[];
  gems: TLostarkGem[];
  arkPassive: TLostarkArkPassive;
  arkGrid: TLostarkArkGrid;
  legendaryAvatars: TLostarkLegendaryAvatar[];
  avatars: TLostarkAvatar[];
  cards: TLostarkCards;
  combatSkills: TLostarkCombatSkill[];
};

export type TLostarkCharacterStat = {
  type: string | null;
  value: string | null;
  tooltip: string | null;
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
  title: string | null;
  tier: string | null;
  quality: number | null;
  itemLevel: string | null;
  enhancement: number | null;
  basicEffects: string[];
  additionalEffects: string[];
  arkPassiveEffects: string[];
};

export type TLostarkAccessory = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  quality: number | null;
  basicEffects: string[];
  additionalEffects: string[];
  polishEffects: TLostarkColoredEffect[];
  arkPassiveEffects: string[];
};

export type TLostarkBracelet = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  basicEffects: string[];
  additionalEffects: string[];
  braceletEffects: TLostarkColoredEffect[];
};

export type TLostarkAbilityStone = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  basicEffects: string[];
  additionalEffects: string[];
  abilityStoneBonusEffects: string[];
  abilityStoneEngravings: {
    name: string;
    level: number | null;
  }[];
};

export type TLostarkOrb = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  specialEffects: string[];
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
  nodes: TLostarkArkPassiveNode[];
};

export type TLostarkArkPassiveNode = {
  category: string | null;
  tier: number | null;
  name: string | null;
  level: number | null;
  icon: string | null;
  description: string | null;
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

export type TLostarkAvatar = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  isInner: boolean | null;
  isSet: boolean | null;
  basicEffects: string[];
  tendencyEffects: string[];
};

export type TLostarkCards = {
  cards: {
    slot: number | null;
    name: string | null;
    icon: string | null;
    awakeCount: number | null;
    awakeTotal: number | null;
    grade: string | null;
  }[];
  effects: {
    index: number | null;
    cardSlots: number[];
    items: {
      name: string | null;
      description: string | null;
    }[];
  }[];
};

export type TLostarkCombatSkill = {
  name: string | null;
  icon: string | null;
  level: number | null;
  type: string | null;
  isAwakening: boolean | null;
  rune: {
    name: string | null;
    icon: string | null;
    grade: string | null;
  } | null;
  tripods: {
    slot: number | null;
    name: string | null;
    icon: string | null;
    level: number | null;
  }[];
};
