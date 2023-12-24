import axios from 'axios';
import { IPost } from '../interfaces/IPost';
import { Requests, callAPI } from '../util/apiConfig';
import { loadRequestInterceptors } from '../util/apiConfig';
import { config } from '../config/appConfig';

const TUITS_API = `${config.apiURL}/posts`;
const USERS_API = `${config.apiURL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);

export const APIfindAllPostsByKeyword = (keyword: string) =>
  callAPI<IPost[]>(
    `${TUITS_API}/search/${keyword}`,
    Requests.GET,
    'Error finding posts by keyword. Try again later.'
  );

export const APIfindAllPosts = () =>
  callAPI<IPost[]>(
    `${TUITS_API}`,
    Requests.GET,
    'Error finding posts. Try again later.'
  );

export const APIfindPostsByUser = (userId: string) =>
  callAPI<IPost[]>(
    `${USERS_API}/${userId}/posts`,
    Requests.GET,
    'Error finding posts by user. Try again later.'
  );

export const APIcreatePost = (userId: string, post: IPost) =>
  callAPI<IPost, IPost>(
    `${USERS_API}/${userId}/posts`,
    Requests.POST,
    'Error creating post. Try again later.',
    post
  );

export const APIupdatePost = (postId: string, post: IPost) =>
  callAPI<IPost, IPost>(
    `${TUITS_API}/${postId}`,
    Requests.PUT,
    'Error updating post.',
    post
  );

export const APIdeletePost = (postId: string) =>
  callAPI<IPost, IPost>(
    `${TUITS_API}/${postId}`,
    Requests.DELETE,
    'Error deleting post.'
  );
