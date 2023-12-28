import { ISearchResults } from '../interfaces/ISearchResults';
import { callAPI, Requests } from '../util/apiConfig';
import { config } from '../config/appConfig';

const SEARCH_API = `${config.apiURL}/search`;

export const APIfindAllByKeyword = (keyword: string) => {
  return callAPI<ISearchResults>(`${SEARCH_API}/${keyword}`, Requests.GET);
};

export const APIfindAllPostsByKeyword = (keyword: string) =>
  callAPI<ISearchResults>(`${SEARCH_API}/posts/${keyword}`, Requests.GET);

export const APIfindAllUsersByKeyword = (keyword: string) =>
  callAPI<ISearchResults>(`${SEARCH_API}/users/${keyword}`, Requests.GET);
