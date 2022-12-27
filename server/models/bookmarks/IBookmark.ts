import IPost from '../posts/IPost';
import IUser from '../users/IUser';

/**
 * Model interface of a bookmark
 */
export default interface IBookmark {
  user: IUser;
  post: IPost;
}
