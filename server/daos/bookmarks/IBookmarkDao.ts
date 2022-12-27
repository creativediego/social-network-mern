import IBookmark from '../../models/bookmarks/IBookmark';
/**
 * DAO database operations for bookmarks
 */
export default interface IBookMarkDao {
  create(userId: string, postId: string): Promise<IBookmark>;
  findAllByUser(userId: string): Promise<IBookmark[]>;
  delete(bookmarkId: string): Promise<IBookmark>;
  deleteAllByUser(bookmarkId: string): Promise<number>;
}
