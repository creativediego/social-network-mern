import { auth } from './firebase-config';
/**
 * Checks if an API call error has the intended server error message. If so, returns the error; otherwise, if the error is unspecified, creates a friendly generic user-facing error.
 * @param err the error object caught from the API call
 * @returns the intended server error or a generic error message
 */
export const processError = (err) => {
  if (err.response.data.error) {
    return err.response.data;
  }
  return { error: 'Sorry! Something went wrong.', status: err.response.status };
};

export const loadRequestInterceptors = function (config) {
  setHeaders(config);
  return config;
};

export const setHeaders = function (config) {
  const token = localStorage.getItem('token');
  config.headers.authorization = token;
  return config;
};

export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = (token) => localStorage.getItem('token', token);
