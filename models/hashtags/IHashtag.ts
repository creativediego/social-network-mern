import IPost from '../posts/IPost';
import IUser from '../users/IUser';

/**
 * Model interface for a like.
 */
export default interface IHashtag {
  hashtag: string;
  post: IPost;
}
