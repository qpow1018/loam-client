import LOSTARK from '@/define/lostark';
import {
  LDB_MainClassInfo,
  LDB_ClassInfo,
  LDB_MainClassInfoAndClasses,
} from '@/types/loaDB';

class LoaDB {
  public getMainClassInfos(): LDB_MainClassInfo[] {
    return Object.values(LOSTARK.mainClassInfo);
  }

  public getClassInfoByMainClass(mainClassValue: string): LDB_ClassInfo[] {
    const allClassInfos = Object.values(LOSTARK.classInfo);
    return allClassInfos.filter(item => item.mainClass === mainClassValue);
  }

  public getAllClassInfos(): LDB_MainClassInfoAndClasses[] {
    const mainClassInfos = this.getMainClassInfos();
    return mainClassInfos.map(mainClassInfo => ({
      mainClassInfo: mainClassInfo,
      classes: this.getClassInfoByMainClass(mainClassInfo.value),
    }));
  }

}

const _instance = new LoaDB();
export default _instance;