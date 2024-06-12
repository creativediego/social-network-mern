/**
 * Interacts with the Search API. It contains methods that search for users, posts, and all.
 */
import { IPost } from '../interfaces/IPost';
import { ISearchResults } from '../interfaces/ISearchResults';
import { ISearchService } from '../interfaces/ISearchService';
import { IUser } from '../interfaces/IUser';
import { apiService } from './APIService';
import { urlConfig } from '../config/appConfig';
import { ReqType } from './APIService';

const SEARCH_API = `${urlConfig.apiURL}/search`;

export const userSearchService: ISearchService<IUser[]> = {
  async search(query: string): Promise<IUser[]> {
    return await apiService.makeRequest<IUser[]>(
      `${SEARCH_API}/users/${query}`,
      ReqType.GET,
      `Error searching for ${query}`
    );
  },
};

export const postSearchService: ISearchService<IPost[]> = {
  async search(query: string): Promise<IPost[]> {
    return await apiService.makeRequest<IPost[]>(
      `${SEARCH_API}/posts/${query}`,
      ReqType.GET,
      `Error searching for ${query}`
    );
  },
};

export const allSearchService: ISearchService<ISearchResults> = {
  async search(query: string): Promise<ISearchResults> {
    return await apiService.makeRequest<ISearchResults>(
      `${SEARCH_API}/${query}`,
      ReqType.GET,
      `Error searching for ${query}`
    );
  },
};
