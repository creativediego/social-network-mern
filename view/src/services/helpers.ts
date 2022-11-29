import axios from 'axios';
import { IAlert, ResponseError } from '../interfaces/IError';

export enum Requests {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

const api = axios.create();

export const loadRequestInterceptors = function (config: any) {
  setHeaders(config);
  return config;
};

api.interceptors.request.use(loadRequestInterceptors);
export const makeAPICall = <T>(
  url: string,
  method: Requests,
  data?: any
): Promise<T | ResponseError> =>
  api({
    method,
    url,
    data,
  })
    .then((response) => response.data)
    .catch((err) => processError(err));

export const setHeaders = function (config: any) {
  const token = localStorage.getItem('token');
  config.headers.authorization = `Bearer ${token}`;
  return config;
};

export const setAuthToken = (token: any) => {
  localStorage.setItem('token', token);
};

export const clearToken = () => {
  localStorage.removeItem('token');
};

export const getAuthToken = (token: any) => localStorage.getItem('token');

/**
 * Checks if an API call error has the intended server error message. If so, returns the error; otherwise, if the error is unspecified, creates a friendly generic user-facing error.
 * @param err the error object caught from the API call
 * @returns the intended server error or a generic error message
 */
export const processError = (err: any): IAlert => {
  if (err.response.data.error) {
    return err.response.data;
  }
  return { message: 'Sorry! Something went wrong.', code: err.response.status };
};

export const isError = (value: any): value is ResponseError => {
  return value.error && value.error.message !== undefined;
};
