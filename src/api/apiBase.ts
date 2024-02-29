import axios from 'axios';

// TODO
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

      console.log('resData', resData);

    } catch (error) {
      // console.error('error', error);
      throw new Error('api 에러 체크');
      
    }
  }

  public async get(url: string) {
    return await this.apiRequest(HTTPMethods.GET, url);
  }


}

export default APIBase.getInstance();