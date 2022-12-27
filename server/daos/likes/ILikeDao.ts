import ILike from '../../models/likes/ILike';
import IPost from '../../models/posts/IPost';
import IUser from '../../models/users/IUser';
/**
 * Common operations for a DAO handling the likes resource.
 */
export default interface ILikeDao {
  // dislikeExists(userId: string, postId: string): Promise<any>;
  findLike(userId: string, postId: string): Promise<ILike | null>;
  findDislike(userId: string, postId: string): Promise<ILike | null>;
  createLike(uid: string, postId: string): Promise<IPost>;
  createDislike(uid: string, postId: string): Promise<IPost>;
  deleteLike(uid: string, postId: string): Promise<IPost>;
  deleteDislike(uid: string, postId: string): Promise<IPost>;
  findAllUsersByPostLike(postId: string): Promise<IUser[]>;
  findAllPostsLikedByUser(uid: string): Promise<IPost[]>;
  findAllPostsDislikedByUser(uid: string): Promise<IPost[]>;
}
