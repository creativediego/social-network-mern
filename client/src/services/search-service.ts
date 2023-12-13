import axios from 'axios';
import { ISearchResults } from '../interfaces/ISearchResults';
import { callAPI, Requests } from './api-helpers';
import { loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';

const SEARCH_API = `${config.apiURL}/search`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);

export const findAllByKeyword = (keyword: string) => {
  return callAPI<ISearchResults>(`${SEARCH_API}/${keyword}`, Requests.GET);
};

export const findAllPostsByKeyword = (keyword: string) =>
  callAPI<ISearchResults>(`${SEARCH_API}/posts/${keyword}`, Requests.GET);

export const findAllUsersByKeyword = (keyword: string) =>
  callAPI<ISearchResults>(`${SEARCH_API}/users/${keyword}`, Requests.GET);
