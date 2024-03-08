import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5500',
  timeout: 3000,
  // headers: {}
});

enum HTTPMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

class APIBase {
  private static _instance: APIBase | null = null;
  public static getInstance() {
    if (APIBase._instance === null) {
      APIBase._instance = new APIBase();
    }
    return APIBase._instance;
  }

  private async apiRequest(method: HTTPMethods, url: string, data?: Object) {
    try {
      const resData = await axiosInstance({
        method: method,
        url: url,
        data: data,
      });

      return resData.data.data;

    } catch (error) {
      console.error('api error', error);
      throw error;
    }
  }

  public async get(url: string) {
    return await this.apiRequest(HTTPMethods.GET, url);
  }

  public async post(url: string, data?: Object) {
    return await this.apiRequest(HTTPMethods.POST, url, data);
  }

  public async put(url: string, data?: Object) {
    return await this.apiRequest(HTTPMethods.PUT, url, data);
  }

  public async delete(url: string) {
    return await this.apiRequest(HTTPMethods.DELETE, url);
  }
}

export default APIBase.getInstance();