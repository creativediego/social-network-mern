import axios from 'axios';
import { ITuit } from '../interfaces/ITuit';
import { processError } from './helpers';
import { loadRequestInterceptors } from './helpers';
const TUITS_API = `${process.env.REACT_APP_API_URL}/tuits`;
const USERS_API = `${process.env.REACT_APP_API_URL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);

export const findAllTuitsByKeyword = (keyword: string) =>
  api
    .get(`${TUITS_API}/search/${keyword}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findAllTuits = () =>
  api
    .get(TUITS_API)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findTuitsByUser = (userId: string) =>
  api
    .get(`${USERS_API}/${userId}/tuits`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const createTuit = (userId: string, tuit: ITuit) =>
  api
    .post(`${USERS_API}/${userId}/tuits`, tuit)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const updateTuit = (tuitId: string, tuit: ITuit) =>
  api
    .put(`${TUITS_API}/${tuitId}`, tuit)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const deleteTuit = (tuitId: string) =>
  api
    .delete(`${TUITS_API}/${tuitId}`)
    .then((response) => response.data)
    .catch((err) => processError(err));