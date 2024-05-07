import { IPost } from '../../post/models/IPost';
import { IUser } from '../../user/models/IUser';

/**
 * Model interface for a like.
 */
export interface ILike {
  user: IUser;
  post: IPost;
}
