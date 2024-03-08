import { v4 as uuidv4 } from 'uuid';

import LOSTARK from '@/define/lostark';
import {
  LDB_MainClassInfo,
  LDB_ClassInfo,
  LDB_MainClassInfoAndClasses,
  LDB_MyCharacterInfo,
} from '@/types/loaDB';

import { dataStorage, DataStorageKey } from '@/libs';

class LoaDB {
  // Game Data
  public getMainClassInfos(): LDB_MainClassInfo[] {
    return Object.values(LOSTARK.mainClassInfo);
  }

  public getClassInfoByMainClass(mainClassValue: string): LDB_ClassInfo[] {
    const allClassInfos = Object.values(LOSTARK.classInfo);
    return allClassInfos.filter(item => item.mainClass === mainClassValue);
  }

  public getClassInfo(classValue: string): LDB_ClassInfo {
    return LOSTARK.classInfo[classValue];
  }

  public getAllClassInfos(): LDB_MainClassInfoAndClasses[] {
    const mainClassInfos = this.getMainClassInfos();
    return mainClassInfos.map(mainClassInfo => ({
      mainClassInfo: mainClassInfo,
      classes: this.getClassInfoByMainClass(mainClassInfo.value),
    }));
  }

  // My Data
  public getMyCharacters(): LDB_MyCharacterInfo[] {
    return dataStorage.local.get(DataStorageKey.myCharacterList, []);
  }

  public addMyCharacter(nickname: string, classValue: string) {
    const myCharacters = this.getMyCharacters();

    const id = uuidv4();
    const newData: LDB_MyCharacterInfo = { id, nickname, classValue };
    const newList = [ ...myCharacters, newData ];

    dataStorage.local.set(DataStorageKey.myCharacterList, newList);
  }

}





const _instance = new LoaDB();
export default _instance;