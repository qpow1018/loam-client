// 게임 데이터
export type TMainClassInfo = {
  value: string;
  label: string;
}

export type TClassInfo = {
  value: string;
  label: string;
  mainClass: string;
  imageUrl: string;
}

export type TMainClassInfoAndClasses = {
  mainClassInfo: TMainClassInfo;
  classes: TClassInfo[];
}

// 내 캐릭터 데이터
export type TMyCharacterInfo = {
  id: string;
  nickname: string;
  classValue: string;
}
