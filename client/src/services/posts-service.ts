import axios from 'axios';
import { IPost } from '../interfaces/IPost';
import { Requests, callAPI } from './api-helpers';
import { loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';

const TUITS_API = `${config.apiURL}/posts`;
const USERS_API = `${config.apiURL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);

export const findAllPostsByKeyword = (keyword: string) =>
  callAPI<IPost[]>(`${TUITS_API}/search/${keyword}`, Requests.GET);

export const findAllPosts = () =>
  callAPI<IPost[]>(`${TUITS_API}`, Requests.GET);

export const findPostsByUser = (userId: string) =>
  callAPI<IPost[]>(`${USERS_API}/${userId}/posts`, Requests.GET);

export const createPost = (userId: string, post: IPost) =>
  callAPI<IPost>(`${USERS_API}/${userId}/posts`, Requests.POST, post);

export const updatePost = (postId: string, post: IPost) =>
  callAPI<IPost>(`${TUITS_API}/${postId}`, Requests.PUT, post);

export const deletePost = (postId: string) =>
  callAPI<IPost>(`${TUITS_API}/${postId}`, Requests.DELETE);
