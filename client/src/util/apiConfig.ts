// import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
// import { handleError } from './apiErrorHandling';

// // Specify the HTTP methods that can be used.
// export enum Requests {
//   GET = 'get',
//   POST = 'post',
//   PUT = 'put',
//   DELETE = 'delete',
// }

// const API = axios.create();

// /**
//  * Sets the authorization header for the request by getting the token from local storage and adding it to the request headers.
//  * @param config the config object for the request
//  * @returns the config object with the authorization header set
//  */
// export const setHeaders = function (
//   config: AxiosRequestConfig
// ): AxiosRequestConfig {
//   const token = localStorage.getItem('token');

//   if (config.headers) {
//     config.headers.authorization = `Bearer ${token}`;
//   } else {
//     config.headers = {
//       authorization: `Bearer ${token}`,
//     };
//   }

//   return config;
// };

// API.interceptors.request.use(setHeaders);

// /**
//  *  Call the API with the given parameters. If the call fails, throw a FriendlyError.
//  * @param url the url to call
//  * @param method the HTTP method to use
//  * @param errorMessage the friendly error message to display if the call fails
//  * @param data the optional data to send with the call of type U
//  * @returns a promise that resolves to the response generic type T
//  */
// export const callAPI = <T, U = undefined>(
//   url: string,
//   method: Requests,
//   errorMessage?: string,
//   data?: U
// ): Promise<T> =>
//   API({
//     method,
//     url,
//     data,
//   })
//     .then((response: AxiosResponse) => response.data)
//     .catch(handleError(errorMessage));
