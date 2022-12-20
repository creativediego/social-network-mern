import axios from 'axios';
import { loadRequestInterceptors } from './helpers';

const BASE_URL = process.env.REACT_APP_API_URL;
const USERS_API = `${BASE_URL}/users`;
const TUITS_API = `${BASE_URL}/posts`;

const api = axios.create();
// api.defaults.headers.common['Authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);
export const findAllPostsLikedByUser = (userId: string) =>
  api
    .get(`${USERS_API}/${userId}/likes`)
    .then((response) => response.data)
    .catch((err) => err.response.data);

export const findAllPostsDislikedByUser = (userId: string) =>
  api
    .get(`${USERS_API}/${userId}/dislikes`)
    .then((response) => response.data)
    .catch((err) => err.response.data);

export const findAllUsersThatLikedPost = (tid: string) =>
  api.get(`${TUITS_API}/${tid}/likes`).then((response) => response.data);

export const userLikesPost = (userId: string, postId: string) => {
  return api
    .post(`${USERS_API}/${userId}/posts/${postId}/likes`)
    .then((response) => response.data)
    .catch((err) => err.response.data);
};

export const userDislikesPost = (userId: string, postId: string) =>
  api
    .post(`${USERS_API}/${userId}/posts/${postId}/dislikes`)
    .then((response) => response.data)
    .catch((err) => err.response.data);
