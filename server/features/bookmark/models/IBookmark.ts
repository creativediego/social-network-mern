import { IPost } from '../../post/models/IPost';
import { IUser } from '../../user/models/IUser';

/**
 * Model interface of a bookmark
 */
export default interface IBookmark {
  user: IUser;
  post: IPost;
}
