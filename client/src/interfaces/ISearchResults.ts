import { IPost } from './IPost';
import { IUser } from './IUser';

export interface ISearchResults {
  posts: IPost[];
  users: IUser[];
}
