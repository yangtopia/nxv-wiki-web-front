import axios, { AxiosInstance } from 'axios';

let _instance: AxiosInstance;

function configureAxios() {
  if (_instance) {
    return _instance;
  }

  _instance = axios.create({
    baseURL: process.env.NXV_ENV.API_BASE_URL,
  });

  _instance.interceptors.request.use(
    (request) => {
      return request;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return _instance;
}

export default configureAxios();
