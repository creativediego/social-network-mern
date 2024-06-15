import { IPost } from '../../post/models/IPost';
import { IUser } from '../../user/models/IUser';

/**
 * Represents the search results.
 */
export interface ISearchResults {
  posts: IPost[];
  users: IUser[];
}
