import mongoose, { Schema } from 'mongoose';
import { MongooseError } from '../../../common/errors/MongooseError';
import IBookmark from './IBookmark';
import { IUser } from '../../user/models/IUser';
import UserModel from '../../user/models/UserModel';
import { formatSchemaJSON } from '../../../common/util/formatSchemaJSON';

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
    throw new MongooseError('User not found.');
  }
});

formatSchemaJSON(BookmarkSchema);
export default BookmarkSchema;
