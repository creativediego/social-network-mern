import axios from 'axios';
import { FriendlyError } from '../interfaces/IError';
import { handleError, logError } from './errorHandling';

export enum Requests {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

const api = axios.create();

export const setHeaders = function (config: any) {
  const token = localStorage.getItem('token');
  config.headers.authorization = `Bearer ${token}`;
  return config;
};

export const loadRequestInterceptors = function (config: any) {
  setHeaders(config);
  return config;
};
api.interceptors.request.use(loadRequestInterceptors);

/**
 *  Call the API with the given parameters. If the call fails, throw a FriendlyError.
 * @param url the url to call
 * @param method the HTTP method to use
 * @param errorMessage the friendly error message to display if the call fails
 * @param data the optional data to send with the call of type U
 * @returns a promise that resolves to the response generic type T
 */
export const callAPI = <T, U = undefined>(
  url: string,
  method: Requests,
  errorMessage?: string,
  data?: U
): Promise<T> =>
  api({
    method,
    url,
    data,
  })
    .then((response) => response.data)
    .catch(handleError(errorMessage));
