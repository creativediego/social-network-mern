import axios from 'axios';
import { Requests, callAPI, loadRequestInterceptors } from '../util/apiConfig';
import { config } from '../config/appConfig';
import { IPost } from '../interfaces/IPost';

const BASE_URL = config.apiURL;
const USERS_API = `${BASE_URL}/users`;
const TUITS_API = `${BASE_URL}/posts`;

const api = axios.create();
// api.defaults.headers.common['Authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);
export const APIfindAllPostsLikedByUser = (userId: string) =>
  callAPI<IPost[]>(
    `${USERS_API}/${userId}/likes`,
    Requests.GET,
    'Error getting posts. Try again later.'
  );

export const APIfindAllPostsDislikedByUser = (userId: string) =>
  callAPI<IPost[]>(
    `${USERS_API}/${userId}/dislikes`,
    Requests.GET,
    'Error getting posts. Try again later.'
  );

export const APIfindAllUsersThatLikedPost = (tid: string) =>
  callAPI<IPost[]>(
    `${TUITS_API}/${tid}/likes`,
    Requests.GET,
    'Error getting posts. Try again later.'
  );

export const APIuserLikesPost = (userId: string, postId: string) =>
  callAPI<IPost>(
    `${USERS_API}/${userId}/posts/${postId}/likes`,
    Requests.POST,
    'Error liking post. Try again later.'
  );

export const APIuserDislikesPost = (userId: string, postId: string) =>
  callAPI<IPost>(
    `${USERS_API}/${userId}/posts/${postId}/dislikes`,
    Requests.POST,
    'Error disliking post. Try again later.'
  );
