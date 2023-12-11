import axios from 'axios';
import { IPost } from '../interfaces/IPost';
import { processError } from './helpers';
import { loadRequestInterceptors } from './helpers';
import { config } from '../config/appConfig';

const TUITS_API = `${config.apiURL}/posts`;
const USERS_API = `${config.apiURL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);

export const findAllPostsByKeyword = (keyword: string) =>
  api
    .get(`${TUITS_API}/search/${keyword}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findAllPosts = () =>
  api
    .get(TUITS_API)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findPostsByUser = (userId: string) =>
  api
    .get(`${USERS_API}/${userId}/posts`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const createPost = (userId: string, post: IPost) =>
  api
    .post(`${USERS_API}/${userId}/posts`, post)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const updatePost = (postId: string, post: IPost) =>
  api
    .put(`${TUITS_API}/${postId}`, post)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const deletePost = (postId: string) =>
  api
    .delete(`${TUITS_API}/${postId}`)
    .then((response) => response.data)
    .catch((err) => processError(err));
