import axios from 'axios';
import { Requests, callAPI, loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';

const BASE_URL = config.apiURL;
const USERS_API = `${BASE_URL}/users`;
const TUITS_API = `${BASE_URL}/posts`;

const api = axios.create();
// api.defaults.headers.common['Authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);
export const findAllPostsLikedByUser = (userId: string) =>
  callAPI(`${USERS_API}/${userId}/likes`, Requests.GET);

export const findAllPostsDislikedByUser = (userId: string) =>
  callAPI(`${USERS_API}/${userId}/dislikes`, Requests.GET);

export const findAllUsersThatLikedPost = (tid: string) =>
  callAPI(`${TUITS_API}/${tid}/likes`, Requests.GET);

export const userLikesPost = (userId: string, postId: string) =>
  callAPI(`${USERS_API}/${userId}/posts/${postId}/likes`, Requests.POST);

export const userDislikesPost = (userId: string, postId: string) =>
  callAPI(`${USERS_API}/${userId}/posts/${postId}/dislikes`, Requests.POST);
