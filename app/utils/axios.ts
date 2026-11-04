import Axios, { AxiosInstance } from 'axios';
import { API_BASE_URL, sessionStorageName } from '@/config';
import { User } from '@/types';

const axiosInstance: AxiosInstance = Axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000 // 1 minutes
});

const axios = (url?: string, token?: string) => {
  if (token) {
    axiosInstance.defaults.headers.Authorization = token;
  }
  if (url) {
    axiosInstance.defaults.baseURL = `${API_BASE_URL}${url}`;
  }

  return axiosInstance;
};

axiosInstance.interceptors.request.use(
  (config: any) => {
    let storedSession;
    if (typeof window !== 'undefined') {
      storedSession = sessionStorage.getItem(sessionStorageName);
    }

    if (storedSession) {
      const storedSessionObj: Partial<User> = JSON.parse(storedSession);
      const token = storedSessionObj.token as string;

      config.headers.Authorization = `${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AxiosObject = axiosInstance;

export default axios;
