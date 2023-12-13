import IPostDao from './IPostDao';
import { Model } from 'mongoose';
import IPost from '../../models/posts/IPost';
import IErrorHandler from '../../errors/IErrorHandler';
import { PostDaoErrors } from './PostDaoErrors';
import IUser from '../../models/users/IUser';
import Post from '../../models/posts/Post';
import DaoNullException from '../../errors/DaoNullException';
import IDao from '../shared/IDao';
import IHashtag from '../../models/hashtags/IHashtag';

/**
 * DAO database CRUD operations for the post resource. Takes the injected dependencies of a {@link Model<IPost>} ORM model and an {@link IErrorHandler} error handler.
 */
export default class PostDao implements IDao<IPost> {
  private readonly postModel: Model<IPost>;
  private readonly userModel: Model<IUser>;
  private readonly hashtagModel: Model<IHashtag>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Builds the DAO by setting model and error handler injected dependencies to state.
   * @param {PostModel} PostModel the Mongoose post model
   * @param {IErrorHandler} errorHandler the error handler to deal with all errors that might occur
   */
  public constructor(
    postModel: Model<IPost>,
    userModel: Model<IUser>,
    hashtagModel: Model<IHashtag>,
    errorHandler: IErrorHandler
  ) {
    this.postModel = postModel;
    this.userModel = userModel;
    this.hashtagModel = hashtagModel;
    this.errorHandler = errorHandler;
    Object.freeze(this); // Make this object immutable.
  }
  findAllByField = async (keyword: string): Promise<any> => {
    const output: IPost[] = [];
    const hashtagsWithPosts = await this.hashtagModel
      .find({ hashtag: keyword })
      .sort({ createdAt: 'descending' })
      .populate({ path: 'post', populate: { path: 'author' } });
    if (hashtagsWithPosts) {
      for (const hashTag of hashtagsWithPosts) {
        output.push(hashTag.post);
      }
    }
    const postsByKeyword = await this.postModel
      .find({
        post: { $regex: keyword, $options: 'i' },
      })
      .sort({ createdAt: 'descending' })
      .populate('author');
    if (postsByKeyword) {
      for (const post of postsByKeyword) {
        output.push(post);
      }
    }
    return output;
  };

  /**
   * Finds all posts belonging by a user id in the database. Populates the post author in the document.
   * @param {string} userId the id of the user.
   * @returns an array of all posts by the user id, with author user populated
   */

  findByField = async (userId: string): Promise<IPost[]> => {
    try {
      const posts = await this.postModel
        .find({ author: userId })
        .sort({ createdAt: 'descending' })
        .populate('author');
      return this.errorHandler.objectOrNullException(
        posts,
        PostDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        PostDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };

  /**
   * Finds all posts in the database.
   * @returns an array of posts
   */
  findAll = async (): Promise<IPost[]> => {
    try {
      return await this.postModel
        .find()
        .sort({ createdAt: 'descending' })
        .populate('author');
    } catch (err) {
      throw this.errorHandler.handleError(
        PostDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };

  /**
   * Finds a single post in the database by its specified id.
   * @param {string} postId the id of the post
   * @returns the post
   */
  findById = async (postId: string): Promise<IPost> => {
    try {
      const post = await this.postModel.findById(postId).populate('author');
      return this.errorHandler.objectOrNullException(
        post,
        PostDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        PostDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };

  exists = async (post: IPost): Promise<boolean> => {
    try {
      const dbPost: IUser | null = await this.postModel.findOne({
        post: post.post,
        author: post.author,
      });
      if (dbPost === null) return false;
      else return true;
    } catch (err) {
      throw this.errorHandler.handleError(PostDaoErrors.DB_ERROR_EXISTS, err);
    }
  };

  /**
   * Create a new post document with all its data by calling the Mongoose PostModel.
   * @param {IPost} postData the new post
   * @returns the newly created post
   */
  create = async (postData: IPost): Promise<IPost> => {
    try {
      // Check if user exists first.
      const existingUser: IUser | null = await this.userModel.findOne({
        uid: postData.author.uid,
      });

      if (existingUser === null) {
        throw new DaoNullException(PostDaoErrors.NO_USER_FOUND);
      } else {
        // Validate post and create.
        const validatedPost: IPost = new Post(postData.post, existingUser);
        const newPost = await (
          await this.postModel.create(validatedPost)
        ).populate('author');

        // if (postData.hashtags && postData.hashtags.length > 0) {
        //   for (const hashtag of postData.hashtags) {
        //     await this.hashtagModel.findOneAndUpdate(
        //       { post: newPost._id, hashtag },
        //       { hashtag },
        //       { upsert: true }
        //     );
        //   }
        // }

        return newPost;
      }
    } catch (err) {
      throw this.errorHandler.handleError(
        PostDaoErrors.DB_ERROR_CREATING_TUIT,
        err
      );
    }
  };

  /**
   * Updates a post in the database by its id.
   * @param {string} postId the id of the post
   * @param {IPost} post the post with the information used for the update.
   * @returns the updated post
   */
  update = async (postId: string, post: IPost): Promise<IPost> => {
    try {
      const updatedPost: IPost | null = await this.postModel
        .findOneAndUpdate({ _id: postId }, post, {
          new: true,
        })
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedPost,
        PostDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        PostDaoErrors.DB_ERROR_UPDATING_TUIT,
        err
      );
    }
  };

  /**
   * Deletes a particular post from the database.
   * @param {string} postId the id of the post.
   * @returns the deleted post
   */
  delete = async (postId: string): Promise<IPost> => {
    try {
      const postToDelete = await this.postModel
        .findOneAndDelete({
          _id: postId,
        })
        .populate('author');
      return this.errorHandler.objectOrNullException(
        postToDelete,
        PostDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        PostDaoErrors.DB_ERROR_DELETING_TUIT,
        err
      );
    }
  };
}
