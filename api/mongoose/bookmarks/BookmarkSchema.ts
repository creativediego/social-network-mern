import mongoose, { Schema } from 'mongoose';
import MongooseException from '../../errors/MongooseException';
import IBookmark from '../../models/bookmarks/IBookmark';
import IUser from '../../models/users/IUser';
import UserModel from '../users/UserModel';
import { formatJSON } from '../util/formatJSON';

/**
 * Mongoose schema for the bookmarks resource that takes an {@link IBookmark} interface. The schema contains a user and post foreign key references. All fields are required, and created/updated time stamps are added.
 * @constructor BookmarkSchema
 * @param {Schema.Types.ObjectId} user the user foreign key
 * @param {Schema.Types.ObjectId} post the post foreign key
 * @module BookmarkSchema
 *
 */
const BookmarkSchema = new mongoose.Schema<IBookmark>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'PostModel', required: true },
  },
  {
    timestamps: true,
    collection: 'bookmarks',
  }
);

/**
 * Prevents bookmark duplicates.
 */
BookmarkSchema.index(
  {
    user: 1,
    post: 1,
  },
  {
    unique: true,
  }
);

BookmarkSchema.pre('save', async function (next): Promise<void> {
  const existingUser: IUser | null = await UserModel.findById(this.user);
  if (existingUser === null) {
    throw new MongooseException('User not found.');
  }
});

formatJSON(BookmarkSchema);
export default BookmarkSchema;
