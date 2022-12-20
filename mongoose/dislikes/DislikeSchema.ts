import mongoose, { Schema } from 'mongoose';

import MongooseException from '../../errors/MongooseException';
import ILike from '../../models/likes/ILike';
import IPost from '../../models/posts/IPost';
import IUser from '../../models/users/IUser';
import PostModel from '../posts/PostModel';
import UserModel from '../users/UserModel';
import { formatJSON } from '../util/formatJSON';

const DislikeSchema = new mongoose.Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'PostModel', required: true },
  },
  {
    timestamps: true,
    collection: 'dislikes',
  }
);

/**
 * A like document be unique by user and post to avoid duplicates.
 */
DislikeSchema.index(
  {
    user: 1,
    post: 1,
  },
  { unique: true }
);
/**
 * Check if users exist before creating like.
 */
DislikeSchema.pre('save', async function (next): Promise<void> {
  const existingUser: IUser | null = await UserModel.findById(this.user);
  if (existingUser === null) {
    throw new MongooseException('User not found.');
  }
  const existingPost: IPost | null = await PostModel.findOne({
    _id: this.post,
  });
  if (existingPost === null) {
    throw new MongooseException('Post not found.');
  }
});

formatJSON(DislikeSchema);
export default DislikeSchema;
