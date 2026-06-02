// 내 캐릭터 데이터
export type TMyCharacterInfo = {
  id: string;
  nickname: string;
  className: string;
  itemLevel: string;
  isMain?: boolean;
};

export type TCreateMyCharacterInfo = Omit<TMyCharacterInfo, 'id' | 'isMain'>;
