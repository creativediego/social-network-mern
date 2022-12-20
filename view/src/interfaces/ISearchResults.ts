import { IPost } from './IPost';
import { IUser } from './IUser';

export interface ISearchResults {
  tuits: IPost[];
  users: IUser[];
}
