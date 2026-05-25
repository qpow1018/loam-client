import LOSTARK from '@/define/lostark';

import type {
  TMainClassInfo,
  TClassInfo,
  TMainClassInfoAndClasses,
} from '@/app/my-characters/_type/lostark';

export function getMainClassInfos(): TMainClassInfo[] {
  return Object.values(LOSTARK.mainClassInfo);
}

export function getClassInfoByMainClass(mainClassValue: string): TClassInfo[] {
  const allClassInfos = Object.values(LOSTARK.classInfo);
  return allClassInfos.filter((item) => item.mainClass === mainClassValue);
}

export function getClassInfo(classValue: string): TClassInfo {
  return LOSTARK.classInfo[classValue];
}

export function getAllClassInfos(): TMainClassInfoAndClasses[] {
  const mainClassInfos = getMainClassInfos();
  return mainClassInfos.map((mainClassInfo) => ({
    mainClassInfo,
    classes: getClassInfoByMainClass(mainClassInfo.value),
  }));
}
