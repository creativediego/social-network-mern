import { Model } from 'mongoose';
import { BookmarkDaoErrors } from './BookmarkDaoErrors';
import IErrorHandler from '../../errors/IErrorHandler';
import IBookmark from '../../models/bookmarks/IBookmark';
import IBookMarkDao from './IBookmarkDao';

/**
 * Database operations for the bookmarks resource. Takes a mongoose bookmark model and error handler as a dependency.
 */
export default class BookmarkDao implements IBookMarkDao {
  private readonly bookmarkModel: Model<IBookmark>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Constructs the DAO with a bookmark model and error handler.
   * @param {Model<IBookmark>} bookmarkModel the mongoose bookmark model
   * @param {IErrorHandler} errorHandler the error handler for all errors
   */
  public constructor(
    bookmarkModel: Model<IBookmark>,
    errorHandler: IErrorHandler
  ) {
    this.bookmarkModel = bookmarkModel;
    this.errorHandler = errorHandler;
  }

  /**
   * Create a new bookmark document with the user and post foreign keys, and then populates the bookmark with the posts and the authors to be sent back to the caller.
   * @param {string} userId the user id
   * @param {string} postId the post id
   * @returns IBookmark Promise
   */
  create = async (userId: string, postId: string): Promise<IBookmark> => {
    try {
      // Create the new book mark, populate the post and the author of each post.
      return await (
        await this.bookmarkModel.create({ user: userId, post: postId })
      ).populate({
        path: 'post',
        populate: { path: 'author' },
      });
    } catch (err) {
      throw this.errorHandler.handleError(
        BookmarkDaoErrors.DB_ERROR_CREATING_BOOKMARKS,
        err
      );
    }
  };

  /**
   * Find all bookmarks for the specified user in the database. Populate the posts and post authors associated with the bookmarks.
   * @param {string} userId the id of the user
   * @returns an array of IBookMark bookmarks
   */
  findAllByUser = async (userId: string): Promise<IBookmark[]> => {
    try {
      return await this.bookmarkModel.find({ user: userId }).populate({
        path: 'post',
        populate: { path: 'author' },
      });
    } catch (err) {
      throw this.errorHandler.handleError(
        BookmarkDaoErrors.DB_ERROR_FINDING_BOOKMARKS + 'userId: ' + userId,
        err
      );
    }
  };

  /**
   * Delete a bookmark document with the bookmark id, and then returned the deleted bookmark to the caller.
   * @param {string} userId the user id
   * @param {string} postId the post id
   * @returns IBookmark Promise
   */
  delete = async (bookmarkId: string): Promise<IBookmark> => {
    try {
      const deletedBookmark: IBookmark | null =
        await this.bookmarkModel.findOneAndDelete({
          _id: bookmarkId,
        });
      return this.errorHandler.objectOrNullException(
        deletedBookmark,
        BookmarkDaoErrors.NO_BOOK_MARK_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        BookmarkDaoErrors.DB_ERROR_DELETING_BOOKMARK +
          ' bookmarkId: ' +
          bookmarkId,
        err
      );
    }
  };
  deleteAllByUser = async (userId: string): Promise<number> => {
    try {
      return await (
        await this.bookmarkModel.deleteMany({ user: userId })
      ).deletedCount;
    } catch (err) {
      throw this.errorHandler.handleError(
        BookmarkDaoErrors.DB_ERROR_DELETE_ALL_BOOKMARKS + ' userId: ' + userId,
        err
      );
    }
  };
}
