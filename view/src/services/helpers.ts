import axios from 'axios';

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
export const makeAPICall = (url: string, method: Requests, data?: any) =>
  api({
    method,
    url,
    data,
  })
    .then((response) => response.data)
    .catch((err) => err.response.data);

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
export const processError = (err: any) => {
  if (err.response.data.error) {
    return err.response.data;
  }
  return { error: 'Sorry! Something went wrong.', code: err.response.status };
};
