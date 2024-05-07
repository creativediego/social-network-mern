import { IPost } from '../../post/models/IPost';
import { IUser } from '../../user/models/IUser';

export interface ISearchResults {
  posts: IPost[];
  users: IUser[];
}
