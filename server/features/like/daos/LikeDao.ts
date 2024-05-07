import { Model } from 'mongoose';
import { ILikeDao } from './ILikeDao';
import { ILike } from '../models/ILike';
import { DatabaseError } from '../../../common/errors/DatabaseError';
import { AbstractMongoDAO } from '../../../common/interfaces/AbstractMongoDAO';
import { IPost } from '../../post/models/IPost';

/**
 * Handles database CRUD operations for the likes resource. Implements {@link ILikeDao} and works with the mongoose {@link LikeModel} to access the database.
 */
export class LikeDao extends AbstractMongoDAO<ILike> implements ILikeDao {
  /**
   * Builds the DAO with the injected dependencies of a mongoose like model ({@link LikeModel}) and an error handler.
   * @param {LikeModel} likeModel the like model for the database operations
   */
  public constructor(likeModel: Model<ILike>) {
    super(likeModel, 'like');
    Object.freeze(this); // Make this object immutable.
  }

  public createLike = async (
    userId: string,
    postId: string
  ): Promise<ILike> => {
    try {
      const like = await this.model.findOneAndUpdate(
        { user: userId, post: postId },
        { user: userId, post: postId },
        { new: true, upsert: true }
      );
      return like;
    } catch (error) {
      throw new DatabaseError(`Error while creating like.`, error);
    }
  };

  public findAllPostsLikedByUser = async (
    userId: string,
    page = 1,
    number = 20
  ): Promise<IPost[]> => {
    try {
      const posts: IPost[] = [];
      const likes = await this.model
        .find({ user: userId })
        .skip((page - 1) * number)
        .limit(number)
        .populate({ path: 'post', populate: { path: 'author' } });
      for (const like of likes) {
        posts.push(like.post);
      }
      return posts;
    } catch (error) {
      throw new DatabaseError(
        `Error while finding all posts liked by user ID: ${userId}`
      );
    }
  };

  public deleteManyByPostId = async (postId: string): Promise<number> => {
    try {
      const { deletedCount } = await this.model.deleteMany({ post: postId });
      return deletedCount;
    } catch (error) {
      throw new DatabaseError(
        `Error while deleting likes by post ID: ${postId}`
      );
    }
  };
}
