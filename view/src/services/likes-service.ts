import axios from 'axios';
import { loadRequestInterceptors } from './helpers';

const BASE_URL = process.env.REACT_APP_API_URL;
const USERS_API = `${BASE_URL}/users`;
const TUITS_API = `${BASE_URL}/tuits`;

const api = axios.create();
// api.defaults.headers.common['Authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);
export const findAllTuitsLikedByUser = (userId: string) =>
  api
    .get(`${USERS_API}/${userId}/likes`)
    .then((response) => response.data)
    .catch((err) => err.response.data);

export const findAllTuitsDislikedByUser = (userId: string) =>
  api
    .get(`${USERS_API}/${userId}/dislikes`)
    .then((response) => response.data)
    .catch((err) => err.response.data);

export const findAllUsersThatLikedTuit = (tid: string) =>
  api.get(`${TUITS_API}/${tid}/likes`).then((response) => response.data);

export const userLikesTuit = (userId: string, tuitId: string) => {
  return api
    .post(`${USERS_API}/${userId}/tuits/${tuitId}/likes`)
    .then((response) => response.data)
    .catch((err) => err.response.data);
};

export const userDislikesTuit = (userId: string, tuitId: string) =>
  api
    .post(`${USERS_API}/${userId}/tuits/${tuitId}/dislikes`)
    .then((response) => response.data)
    .catch((err) => err.response.data);
