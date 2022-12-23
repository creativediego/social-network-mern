import IPost from '../posts/IPost';
import IUser from '../users/IUser';

/**
 * Model interface for a like.
 */
export default interface ILike {
  user: IUser;
  post: IPost;
}
