export type TResMaplestoryMyCharacterRow = {
  id: string;
  user_id: string;
  nickname: string;
  class_name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type TResMaplestoryMyCharacter = {
  id: string;
  nickname: string;
  className: string;
  sortOrder: number;
};

export type TReqCreateMaplestoryMyCharacter = {
  nickname: string;
  className: string;
};

export type TReqUpsertMaplestoryMyCharacterRow = {
  id?: string;
  user_id: string;
  nickname: string;
  class_name: string;
  sort_order: number;
};

export type TMaplestoryUnionGroup = 'special1' | 'luk' | 'str' | 'dex' | 'int' | 'special2';

export type TResMaplestoryUnionCharacterRow = {
  id: string;
  class_name: string;
  union_effect: string;
  link_effect: string;
  group_key: TMaplestoryUnionGroup;
  default_sort_order: number;
};

export type TResMaplestoryUnionUserStateRow = {
  user_id: string;
  character_id: string;
  level: number | null;
  sort_order: number;
};

export type TResMaplestoryUnionCharacter = {
  id: string;
  className: string;
  unionEffect: string;
  linkEffect: string;
  group: TMaplestoryUnionGroup;
  level: number | null;
  sortOrder: number;
};

export type TReqUpsertMaplestoryUnionUserStateRow = {
  user_id: string;
  character_id: string;
  level: number | null;
  sort_order: number;
};

export type TResMaplestoryEquipmentStateRow = {
  id: string;
  character_id: string;
  slot_key: string;
  item_name: string | null;
  bonus_option: string | null;
  starforce: string | null;
  scroll: string | null;
  potential: string | null;
  additional_potential: string | null;
  extra: string | null;
  goal: string | null;
  purchase_price: string | null;
  is_highlighted: boolean;
  created_at: string;
  updated_at: string;
};

export type TMaplestoryEquipmentState = {
  id: string;
  characterId: string;
  slotKey: string;
  itemName: string | null;
  bonusOption: string | null;
  starforce: string | null;
  scroll: string | null;
  potential: string | null;
  additionalPotential: string | null;
  extra: string | null;
  goal: string | null;
  purchasePrice: string | null;
  isHighlighted: boolean;
};

export type TMaplestoryEquipmentStatePatch = Partial<
  Omit<TMaplestoryEquipmentState, 'id' | 'characterId' | 'slotKey'>
>;

export type TReqUpsertMaplestoryEquipmentStateRow = {
  character_id: string;
  slot_key: string;
  item_name: string | null;
  bonus_option: string | null;
  starforce: string | null;
  scroll: string | null;
  potential: string | null;
  additional_potential: string | null;
  extra: string | null;
  goal: string | null;
  purchase_price: string | null;
  is_highlighted: boolean;
};
