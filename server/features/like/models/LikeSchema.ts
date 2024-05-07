import mongoose, { Schema } from 'mongoose';
import { ILike } from './ILike';
import { IPost } from '../../post/models/IPost';
import { IUser } from '../../user/models/IUser';
import PostModel from '../../post/models/PostModel';
import UserModel from '../../user/models/UserModel';
import { formatSchemaJSON } from '../../../common/util/formatSchemaJSON';
import { DatabaseError } from '../../../common/errors/DatabaseError';

/**
 * Mongoose schema for the likes resource that takes an {@link ILike} object. The schema contains a user and post foreign key references. All fields are required, and created/updated time stamps are added.
 * @constructor LikeSchema
 * @param {Schema.Types.ObjectId} user the user foreign key
 * @param {Schema.Types.ObjectId} post the post foreign key
 * @module LikeSchema
 *
 */
const LikeSchema = new mongoose.Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'PostModel', required: true },
  },
  {
    timestamps: true,
    collection: 'likes',
  }
);

/**
 * A like document be unique by user and post to avoid duplicates.
 */
LikeSchema.index(
  {
    user: 1,
    post: 1,
  },
  { unique: true }
);
/**
 * Check if users exist before creating like.
 */
LikeSchema.pre('save', async function (next): Promise<void> {
  const existingUser: IUser | null = await UserModel.findById(this.user);
  if (existingUser === null) {
    throw new DatabaseError('User not found.');
  }
  const existingPost: IPost | null = await PostModel.findOne({
    _id: this.post,
  });
  if (existingPost === null) {
    throw new DatabaseError('Post not found.');
  }
});

// LikeSchema.post('deleteOne', async function (next): Promise<void> {
//   const postId = this.getQuery().post;
//   const existingPost: IPost | null = await PostModel.findOneAndUpdate(
//     { _id: postId, stats: { likes: { $gt: 0 } } },
//     { $inc: { 'stats.dislikes': 1, 'stats.likes': -1 } }
//   );
//   if (existingPost === null) {
//     throw new MongooseException(
//       'Unable to update post stats after unlike: Post not found.'
//     );
//   }
// });

formatSchemaJSON(LikeSchema);
export default LikeSchema;
