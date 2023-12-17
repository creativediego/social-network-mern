import axios from 'axios';
import { FriendlyError, IAlert } from '../interfaces/IError';

export enum Requests {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

const api = axios.create();

const logError = async (error: IAlert): Promise<void> => {
  // If in production, log error to third-party service.
  if (process.env.REACT_APP_ENV === 'production') {
    // TODO: Log error to third-party service.
  } else {
    console.log(error.message);
  }
};

export const loadRequestInterceptors = function (config: any) {
  setHeaders(config);
  return config;
};

api.interceptors.request.use(loadRequestInterceptors);
export const callAPI = <T>(
  url: string,
  method: Requests,
  data?: any,
  errorMessage?: string
): Promise<T> =>
  api({
    method,
    url,
    data,
  })
    .then((response) => response.data)
    .catch((err) => {
      logError(err.response.data.error);
      if (errorMessage) {
        throw new FriendlyError(errorMessage);
      } else {
        throw new FriendlyError(err.response.data.error.message);
      }
    });

export const setHeaders = function (config: any) {
  const token = localStorage.getItem('token');
  config.headers.authorization = `Bearer ${token}`;
  return config;
};

export const setLocalAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const clearLocalAuthToken = () => {
  localStorage.removeItem('token');
};

export const getLocalAuthToken = (token: any) => localStorage.getItem('token');

export const isError = (value: any): value is FriendlyError => {
  return value instanceof FriendlyError;
};
