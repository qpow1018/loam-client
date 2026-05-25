import { mainClassInfo, classInfo } from '@/app/my-characters/_define/lostark';

import type {
  TClassInfo,
  TMainClassInfoAndClasses,
} from '@/app/my-characters/_type/myCharacters';

export function getClassInfo(classValue: string): TClassInfo {
  return classInfo[classValue];
}

export function getAllClassInfos(): TMainClassInfoAndClasses[] {
  const allClassInfos = Object.values(classInfo);
  return Object.values(mainClassInfo).map((mainClass) => ({
    mainClassInfo: mainClass,
    classes: allClassInfos.filter((c) => c.mainClass === mainClass.value),
  }));
}
