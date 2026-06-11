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
