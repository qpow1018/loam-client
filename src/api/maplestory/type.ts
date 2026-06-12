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
