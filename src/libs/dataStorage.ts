class DataStorage {
  private static _instance: DataStorage | null = null;
  public static getInstance(): DataStorage {
    if (DataStorage._instance === null) {
      DataStorage._instance = new DataStorage();
    }
    return DataStorage._instance;
  }

  private jsonToString(jsonData: any) {
    try {
      const stringData = JSON.stringify(jsonData);
      return stringData;

    } catch (error) {
      console.error(error);
      throw new Error('storage jsonToString error');
    }
  }

  private stringToJson(stringData: string) {
    try {
      const jsonData = JSON.parse(stringData);
      return jsonData;

    } catch (error) {
      console.error(error);
      throw new Error('storage stringToJson error');
    }
  }

  public session = {
    set: (key: string, jsonData: any) => {
      const stringData = this.jsonToString(jsonData);
      window.sessionStorage.setItem(key, stringData);
    },
    get: (key: string, defaultValue: any) => {
      const _data = window.sessionStorage.getItem(key);
      if (_data === null) return defaultValue;
      return this.stringToJson(_data);
    },
    remove: (key: string) => {
      window.sessionStorage.getItem(key);
    }
  }

  public local = {
    set: (key: string, jsonData: any) => {
      const stringData = this.jsonToString(jsonData);
      window.localStorage.setItem(key, stringData);
    },
    get: (key: string, defaultValue: any) => {
      const _data = window.localStorage.getItem(key);
      if (_data === null) return defaultValue;
      return this.stringToJson(_data);
    },
    remove: (key: string) => {
      window.localStorage.getItem(key);
    }
  }
}

enum DataStorageKey {
  myCharacterList = 'LOAM_MY_CHARACTER_LIST',
}

const dataStorage = DataStorage.getInstance();

export {
  dataStorage,
  DataStorageKey
}