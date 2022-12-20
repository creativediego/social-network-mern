import axios from 'axios';
import { ISearchResults } from '../interfaces/ISearchResults';

import { makeAPICall, processError, Requests } from './helpers';
import { loadRequestInterceptors } from './helpers';
const SEARCH_API = `${process.env.REACT_APP_API_URL}/search`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);

export const findAllByKeyword = (keyword: string) => {
  return makeAPICall<ISearchResults>(`${SEARCH_API}/${keyword}`, Requests.GET);
};

export const findAllPostsByKeyword = (keyword: string) =>
  api
    .get(`${SEARCH_API}/posts/${keyword}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findAllUsersByKeyword = (keyword: string) =>
  api
    .get(`${SEARCH_API}/users/${keyword}`)
    .then((response) => response.data)
    .catch((err) => processError(err));
