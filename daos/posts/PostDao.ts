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
 * DAO database CRUD operations for the tuit resource. Takes the injected dependencies of a {@link Model<ITuit>} ORM model and an {@link IErrorHandler} error handler.
 */
export default class PostDao implements IDao<IPost> {
  private readonly tuitModel: Model<IPost>;
  private readonly userModel: Model<IUser>;
  private readonly hashtagModel: Model<IHashtag>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Builds the DAO by setting model and error handler injected dependencies to state.
   * @param {TuitModel} TuitModel the Mongoose tuit model
   * @param {IErrorHandler} errorHandler the error handler to deal with all errors that might occur
   */
  public constructor(
    tuitModel: Model<IPost>,
    userModel: Model<IUser>,
    hashtagModel: Model<IHashtag>,
    errorHandler: IErrorHandler
  ) {
    this.tuitModel = tuitModel;
    this.userModel = userModel;
    this.hashtagModel = hashtagModel;
    this.errorHandler = errorHandler;
    Object.freeze(this); // Make this object immutable.
  }
  findAllByField = async (keyword: string): Promise<any> => {
    const output: IPost[] = [];
    const hashtagsWithTuits = await this.hashtagModel
      .find({ hashtag: keyword })
      .sort({ createdAt: 'descending' })
      .populate({ path: 'tuit', populate: { path: 'author' } });
    if (hashtagsWithTuits) {
      for (const hashTag of hashtagsWithTuits) {
        output.push(hashTag.post);
      }
    }
    const tuitsByKeyword = await this.tuitModel
      .find({
        post: { $regex: keyword, $options: 'i' },
      })
      .sort({ createdAt: 'descending' })
      .populate('author');
    if (tuitsByKeyword) {
      for (const tuit of tuitsByKeyword) {
        output.push(tuit);
      }
    }
    return output;
  };

  /**
   * Finds all tuits belonging by a user id in the database. Populates the tuit author in the document.
   * @param {string} userId the id of the user.
   * @returns an array of all tuits by the user id, with author user populated
   */

  findByField = async (userId: string): Promise<IPost[]> => {
    try {
      const tuits = await this.tuitModel
        .find({ author: userId })
        .sort({ createdAt: 'descending' })
        .populate('author');
      return this.errorHandler.objectOrNullException(
        tuits,
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
   * Finds all tuits in the database.
   * @returns an array of tuits
   */
  findAll = async (): Promise<IPost[]> => {
    try {
      return await this.tuitModel
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
   * Finds a single tuit in the database by its specified id.
   * @param {string} tuitId the id of the tuit
   * @returns the tuit
   */
  findById = async (tuitId: string): Promise<IPost> => {
    try {
      const tuit = await this.tuitModel.findById(tuitId).populate('author');
      return this.errorHandler.objectOrNullException(
        tuit,
        PostDaoErrors.TUIT_NOT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        PostDaoErrors.DB_ERROR_FINDING_TUITS,
        err
      );
    }
  };

  exists = async (tuit: IPost): Promise<boolean> => {
    try {
      const dbTuit: IUser | null = await this.tuitModel.findOne({
        post: tuit.post,
        author: tuit.author,
      });
      if (dbTuit === null) return false;
      else return true;
    } catch (err) {
      throw this.errorHandler.handleError(PostDaoErrors.DB_ERROR_EXISTS, err);
    }
  };

  /**
   * Create a new tuit document with all its data by calling the Mongoose TuitModel.
   * @param {IPost} tuitData the new tuit
   * @returns the newly created tuit
   */
  create = async (tuitData: IPost): Promise<IPost> => {
    try {
      // Check if user exists first.
      const existingUser: IUser | null = await this.userModel.findById(
        tuitData.author
      );

      if (existingUser === null) {
        throw new DaoNullException(PostDaoErrors.NO_USER_FOUND);
      } else {
        // Validate tuit and create.
        const validatedTuit: IPost = new Post(tuitData.post, existingUser);
        const newTuit = await (
          await this.tuitModel.create(validatedTuit)
        ).populate('author');

        // if (tuitData.hashtags && tuitData.hashtags.length > 0) {
        //   for (const hashtag of tuitData.hashtags) {
        //     await this.hashtagModel.findOneAndUpdate(
        //       { tuit: newTuit._id, hashtag },
        //       { hashtag },
        //       { upsert: true }
        //     );
        //   }
        // }

        return newTuit;
      }
    } catch (err) {
      throw this.errorHandler.handleError(
        PostDaoErrors.DB_ERROR_CREATING_TUIT,
        err
      );
    }
  };

  /**
   * Updates a tuit in the database by its id.
   * @param {string} tuitId the id of the tuit
   * @param {IPost} tuit the tuit with the information used for the update.
   * @returns the updated tuit
   */
  update = async (tuitId: string, tuit: IPost): Promise<IPost> => {
    try {
      const updatedTuit: IPost | null = await this.tuitModel
        .findOneAndUpdate({ _id: tuitId }, tuit, {
          new: true,
        })
        .populate('author');
      return this.errorHandler.objectOrNullException(
        updatedTuit,
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
   * Deletes a particular tuit from the database.
   * @param {string} tuitId the id of the tuit.
   * @returns the deleted tuit
   */
  delete = async (tuitId: string): Promise<IPost> => {
    try {
      const tuitToDelete = await this.tuitModel
        .findOneAndDelete({
          _id: tuitId,
        })
        .populate('author');
      return this.errorHandler.objectOrNullException(
        tuitToDelete,
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
