import mongoose from 'mongoose';
import IBookmark from './IBookmark';
import BookmarkSchema from './BookmarkSchema';

/**
 * A Mongoose model for the bookmarks resource that takes a {@link BookmarkSchema}.
 * @module BookmarkModel
 */
export default mongoose.model<IBookmark>('BookmarkModel', BookmarkSchema);
