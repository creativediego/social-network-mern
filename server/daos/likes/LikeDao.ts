import IDao from '../shared/IDao';
import { Model } from 'mongoose';
import ILikeDao from './ILikeDao';
import ILike from '../../models/likes/ILike';
import IUser from '../../models/users/IUser';
import IPost from '../../models/posts/IPost';
import IErrorHandler from '../../errors/IErrorHandler';
import { LikeDaoErrors } from './LikeDaoErrors';
import Post from '../../models/posts/Post';
import DaoDatabaseException from '../../errors/DaoDatabseException';

/**
 * Handles database CRUD operations for the likes resource. Implements {@link ILikeDao} and works with the mongoose {@link LikeModel} to access the database.
 */
export class LikeDao implements ILikeDao {
  private readonly likeModel: Model<ILike>;
  private readonly dislikeModel: Model<ILike>;
  private readonly postModel: Model<IPost>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Builds the DAO with the injected dependencies of a mongoose like model ({@link LikeModel}) and an error handler.
   * @param {LikeModel} likeModel the like model for the database operations
   * @param {IErrorHandler} errorHandler the error handler to process all errors
   */
  public constructor(
    likeModel: Model<ILike>,
    dislikeModel: Model<ILike>,
    postModel: Model<IPost>,
    errorHandler: IErrorHandler
  ) {
    this.likeModel = likeModel;
    this.dislikeModel = dislikeModel;
    this.postModel = postModel;
    this.errorHandler = errorHandler;
    Object.freeze(this); // Make this object immutable.
  }

  createLike = async (userId: string, postId: string): Promise<IPost> => {
    try {
      await this.likeModel.create({
        user: userId,
        post: postId,
      });
      // Increment the likes count and add the user to the likedBy array.
      const updatedPost = await this.postModel
        .findOneAndUpdate(
          { _id: postId },
          { $inc: { 'stats.likes': 1 }, $addToSet: { likedBy: [userId] } },
          { new: true }
        )
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedPost,
        'Failed to update post stats after creating like'
      );
    } catch (err) {
      throw new DaoDatabaseException('Failed to create like.', err);
    }
  };

  createDislike = async (userId: string, postId: string): Promise<IPost> => {
    try {
      await this.dislikeModel.create({
        user: userId,
        post: postId,
      });
      const updatedPost = await this.postModel
        .findOneAndUpdate(
          { _id: postId },
          {
            $inc: { 'stats.dislikes': 1 },
            $addToSet: { dislikedBy: [userId] },
          },
          { new: true }
        )
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedPost,
        'Failed to update post stats after creating dislike'
      );
    } catch (err) {
      throw new DaoDatabaseException('Failed to create dislike.', err);
    }
  };

  findLike = async (userId: string, postId: string): Promise<ILike | null> => {
    try {
      return await this.likeModel.findOne({ user: userId, post: postId });
    } catch (err) {
      throw new DaoDatabaseException('Failed to find like.', err);
    }
  };

  findDislike = async (
    userId: string,
    postId: string
  ): Promise<ILike | null> => {
    try {
      return await this.dislikeModel.findOne({ user: userId, post: postId });
    } catch (err) {
      throw new DaoDatabaseException('Failed to find dislike.', err);
    }
  };

  deleteLike = async (userId: string, postId: string): Promise<IPost> => {
    try {
      const deletedLike = await this.likeModel.deleteOne(
        { user: userId, post: postId },
        { new: true }
      );
      const updatedPost = await this.postModel
        .findOneAndUpdate(
          { _id: postId, 'stats.likes': { $gt: 0 } },
          {
            $inc: { 'stats.likes': -1 },
            $pull: { likedBy: { $in: [userId] } },
          },
          { new: true }
        )
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedPost,
        'Error updating post after deleting like: Post not found.'
      );
    } catch (err) {
      throw new DaoDatabaseException('Failed to delete like.', err);
    }
  };

  deleteDislike = async (userId: string, postId: string): Promise<IPost> => {
    try {
      const deletedDislike = await this.dislikeModel.deleteOne(
        { user: userId, post: postId },
        { new: true }
      );
      const updatedPost = await this.postModel
        .findOneAndUpdate(
          { _id: postId, 'stats.dislikes': { $gt: 0 } },
          {
            $inc: { 'stats.dislikes': -1 },
            $pull: { dislikedBy: { $in: [userId] } },
          },
          { new: true }
        )
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedPost,
        'Error updating post after deleting dislike: Post not found.'
      );
    } catch (err) {
      throw new DaoDatabaseException('Failed to delete dislike.', err);
    }
  };

  /**
   * Finds all users who liked a particular post using the post id.
   * @param {string} postId the id of the post
   * @returns an array of {@link IUser} documents who have liked the post
   */
  findAllUsersByPostLike = async (postId: string): Promise<IUser[]> => {
    try {
      // Get the likes.
      const likes: ILike[] = await this.likeModel
        .find({ post: postId })
        .populate('user')
        .exec();
      // Now that we have all the likes, let's extract just the users.
      const users: IUser[] = [];
      likes.map((like) => {
        users.push(like.user);
      });
      return this.errorHandler.objectOrNullException(
        users,
        LikeDaoErrors.NO_USERS_FOUND_FOR_LIKE
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        LikeDaoErrors.DB_ERROR_USERS_BY_LIKE,
        err
      );
    }
  };

  /**
   * Finds all posts that a user liked by calling the likeModel. Also Populates the liked post.
   * @param {string} userId the id of the user
   * @returns an array of {@link ILike} documents with populated {@link IPost} posts
   */
  findAllPostsLikedByUser = async (userId: string): Promise<IPost[]> => {
    try {
      const likes: ILike[] = await this.likeModel
        .find({ user: userId })
        .populate({ path: 'post', populate: { path: 'author' } })
        .exec();
      const posts: IPost[] = [];
      likes.map((like) => {
        posts.push(like.post);
      });
      return this.errorHandler.objectOrNullException(
        posts,
        LikeDaoErrors.NO_TUITS_FOUND_FOR_LIKE
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        LikeDaoErrors.DB_ERROR_TUITS_BY_LIKE,
        err
      );
    }
  };
  findAllPostsDislikedByUser = async (userId: string): Promise<IPost[]> => {
    try {
      const likes: ILike[] = await this.dislikeModel
        .find({ user: userId })
        .populate({ path: 'post', populate: { path: 'author' } })
        .exec();
      const posts: IPost[] = [];
      likes.map((like) => {
        posts.push(like.post);
      });
      return this.errorHandler.objectOrNullException(
        posts,
        LikeDaoErrors.NO_TUITS_FOUND_FOR_LIKE
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        LikeDaoErrors.DB_ERROR_TUITS_BY_LIKE,
        err
      );
    }
  };
}
