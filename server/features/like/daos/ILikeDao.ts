import { ILike } from '../models/ILike';
import { IPost } from '../../post/models/IPost';
import { IBaseDao } from '../../../common/interfaces/IBaseDao';
/**
 * Common operations for a DAO handling the likes resource.
 */
export interface ILikeDao extends IBaseDao<ILike> {
  createLike(userId: string, postId: string): Promise<ILike>;
  findAllPostsLikedByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<IPost[]>;
  deleteManyByPostId(postId: string): Promise<number>;
}
