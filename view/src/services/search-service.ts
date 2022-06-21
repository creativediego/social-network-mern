import axios from 'axios';
import { processError } from './helpers';
import { loadRequestInterceptors } from './helpers';
const SEARCH_API = `${process.env.REACT_APP_API_URL}/search`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);

export const findAllByKeyword = (keyword: string) =>
  api
    .get(`${SEARCH_API}/${keyword}`)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((err) => processError(err));

export const findAllTuitsByKeyword = (keyword: string) =>
  api
    .get(`${SEARCH_API}/tuits/${keyword}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findAllUsersByKeyword = (keyword: string) =>
  api
    .get(`${SEARCH_API}/users/${keyword}`)
    .then((response) => response.data)
    .catch((err) => processError(err));
