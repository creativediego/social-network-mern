import ILike from '../../models/likes/ILike';
import IPost from '../../models/posts/IPost';
import IUser from '../../models/users/IUser';
/**
 * Common operations for a DAO handling the likes resource.
 */
export default interface ILikeDao {
  // dislikeExists(userId: string, tuitId: string): Promise<any>;
  findLike(userId: string, tuitId: string): Promise<ILike | null>;
  findDislike(userId: string, tuitId: string): Promise<ILike | null>;
  createLike(uid: string, tuitId: string): Promise<IPost>;
  createDislike(uid: string, tuitId: string): Promise<IPost>;
  deleteLike(uid: string, tuitId: string): Promise<IPost>;
  deleteDislike(uid: string, tuitId: string): Promise<IPost>;
  findAllUsersByTuitLike(tuitId: string): Promise<IUser[]>;
  findAllTuitsLikedByUser(uid: string): Promise<IPost[]>;
  findAllTuitsDislikedByUser(uid: string): Promise<IPost[]>;
}
