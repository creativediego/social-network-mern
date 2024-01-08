import { Model } from 'mongoose';
import IPost from '../../models/posts/IPost';
import IErrorHandler from '../../errors/IErrorHandler';
import { PostDaoErrors } from './PostDaoErrors';
import IUser from '../../models/users/IUser';
import DaoNullException from '../../errors/DaoNullException';
import IBaseDao from '../shared/IDao';
import IHashtag from '../../models/hashtags/IHashtag';

/**
 * DAO database CRUD operations for the post resource. Takes the injected dependencies of a {@link Model<IPost>} ORM model and an {@link IErrorHandler} error handler.
 */
export default class PostDao implements IBaseDao<IPost> {
  private readonly postModel: Model<IPost>;
  private readonly userModel: Model<IUser>;
  private readonly hashtagModel: Model<IHashtag>;

  /**
   * Builds the DAO by setting model and error handler injected dependencies to state.
   * @param {PostModel} PostModel the Mongoose post model
   * @param {IErrorHandler} errorHandler the error handler to deal with all errors that might occur
   */
  public constructor(
    postModel: Model<IPost>,
    userModel: Model<IUser>,
    hashtagModel: Model<IHashtag>
  ) {
    this.postModel = postModel;
    this.userModel = userModel;
    this.hashtagModel = hashtagModel;
    Object.freeze(this); // Make this object immutable.
  }

  findOne = async (criteria: Partial<IPost>): Promise<IPost | null> =>
    this.postModel.findOne(criteria || {});

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
    return await this.postModel
      .find({ author: userId })
      .sort({ createdAt: 'descending' })
      .populate('author');
  };

  /**
   * Finds all posts in the database.
   * @returns an array of posts
   */
  findAll = async (): Promise<IPost[]> => {
    return await this.postModel
      .find()
      .sort({ createdAt: 'descending' })
      .populate('author');
  };

  /**
   * Finds a single post in the database by its specified id.
   * @param {string} postId the id of the post
   * @returns the post
   */
  findOneById = async (id: string): Promise<IPost | null> =>
    await this.postModel.findById(id).populate('author');

  /**
   * Create a new post document with all its data by calling the Mongoose PostModel.
   * @param {IPost} postData the new post
   * @returns the newly created post
   */
  create = async (postData: IPost): Promise<IPost> => {
    // Check if user exists first.
    const existingUser: IUser | null = await this.userModel.findOne({
      _id: postData.author.id,
    });

    if (existingUser === null) {
      throw new DaoNullException(PostDaoErrors.NO_USER_FOUND);
    } else {
      const newPost = await (
        await this.postModel.create(postData)
      ).populate('author');

      return newPost;
    }
  };

  /**
   * Updates a post in the database by its id.
   * @param {string} postId the id of the post
   * @param {IPost} post the post with the information used for the update.
   * @returns the updated post
   */
  update = async (
    postId: string,
    post: Partial<IPost>
  ): Promise<IPost | null> =>
    this.postModel
      .findOneAndUpdate(
        { _id: postId },
        { ...post },
        {
          new: true,
        }
      )
      .populate('author');

  /**
   * Deletes a particular post from the database.
   * @param {string} postId the id of the post.
   * @returns the deleted post
   */
  delete = async (postId: string): Promise<boolean> => {
    const deleted = await this.postModel.deleteOne({ _id: postId });
    return deleted.acknowledged;
  };
}
