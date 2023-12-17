import axios from 'axios';
import { IPost } from '../interfaces/IPost';
import { Requests, callAPI } from './api-helpers';
import { loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';

const TUITS_API = `${config.apiURL}/posts`;
const USERS_API = `${config.apiURL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);

export const APIfindAllPostsByKeyword = (keyword: string) =>
  callAPI<IPost[]>(`${TUITS_API}/search/${keyword}`, Requests.GET);

export const APIfindAllPosts = () =>
  callAPI<IPost[]>(`${TUITS_API}`, Requests.GET);

export const APIfindPostsByUser = (userId: string) =>
  callAPI<IPost[]>(`${USERS_API}/${userId}/posts`, Requests.GET);

export const APIcreatePost = (userId: string, post: IPost) =>
  callAPI<IPost>(`${USERS_API}/${userId}/posts`, Requests.POST, post);

export const APIupdatePost = (postId: string, post: IPost) =>
  callAPI<IPost>(`${TUITS_API}/${postId}`, Requests.PUT, post);

export const APIdeletePost = (postId: string) =>
  callAPI<IPost>(`${TUITS_API}/${postId}`, Requests.DELETE);
