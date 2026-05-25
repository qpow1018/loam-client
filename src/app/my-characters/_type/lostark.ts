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
