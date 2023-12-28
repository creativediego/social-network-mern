import { IPost } from '../interfaces/IPost';
import { ISearchResults } from '../interfaces/ISearchResults';
import { ISearchService } from '../interfaces/ISearchService';
import { IUser } from '../interfaces/IUser';
import {
  APIfindAllUsersByKeyword,
  APIfindAllPostsByKeyword,
  APIfindAllByKeyword,
} from './searchAPI';

export const userSearchService: ISearchService<IUser[]> = {
  async search(query: string): Promise<IUser[]> {
    return await APIfindAllUsersByKeyword(query);
  },
};

export const postSearchService: ISearchService<IPost[]> = {
  async search(query: string): Promise<IPost[]> {
    return await APIfindAllPostsByKeyword(query);
  },
};

export const allSearchService: ISearchService<ISearchResults> = {
  async search(query: string): Promise<ISearchResults> {
    return await APIfindAllByKeyword(query);
  },
};
