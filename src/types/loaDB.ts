type LDB_MainClassInfo = {
  value: string;
  label: string;
}

type LDB_ClassInfo = {
  value: string;
  label: string;
  mainClass: string;
  imageUrl: string;
}

type LDB_MainClassInfoAndClasses = {
  mainClassInfo: LDB_MainClassInfo;
  classes: LDB_ClassInfo[];
}

type LDB_MyCharacterInfo = {
  id: string;
  nickname: string;
  classValue: string;
}

export type {
  LDB_MainClassInfo,
  LDB_ClassInfo,
  LDB_MainClassInfoAndClasses,
  LDB_MyCharacterInfo,
}