import apiBase from './apiBase';
import * as Types from '@/types/api';

class API {
  private static _instance: API | null = null;
  public static getInstance() {
    if (API._instance === null) {
      API._instance = new API();
    }
    return API._instance;
  }

  public async getMyCharacters(): Promise<Types.ResMyCharacterInfo[]> {
    return await apiBase.get('/api/my-characters');
  }

  public async addMyCharacter(name: string): Promise<Types.ResMyCharacterInfo | null> {
    return await apiBase.post('/api/my-character', {
      name,
    });
  }

}

export default API.getInstance();