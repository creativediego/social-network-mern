import { ISearchResults } from '../interfaces/ISearchResults';
import { callAPI, Requests } from '../util/apiConfig';
import { configENV } from '../config/appConfig';
import { IPost } from '../interfaces/IPost';
import { IUser } from '../interfaces/IUser';

const SEARCH_API = `${configENV.apiURL}/search`;

export const APIfindAllByKeyword = (keyword: string) => {
  return callAPI<ISearchResults>(`${SEARCH_API}/${keyword}`, Requests.GET);
};

export const APIfindAllPostsByKeyword = (keyword: string) =>
  callAPI<IPost[]>(`${SEARCH_API}/posts/${keyword}`, Requests.GET);

export const APIfindAllUsersByKeyword = (keyword: string) =>
  callAPI<IUser[]>(`${SEARCH_API}/users/${keyword}`, Requests.GET);
