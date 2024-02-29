import apiBase from "./apiBase";

class API {
  private static _instance: API | null = null;
  public static getInstance() {
    if (API._instance === null) {
      API._instance = new API();
    }
    return API._instance;
  }

  public async getMyCharacters() {
    return await apiBase.get('/api/my-characters');
  }






}

export default API.getInstance();