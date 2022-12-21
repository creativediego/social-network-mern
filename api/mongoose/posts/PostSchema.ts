import mongoose, { Schema } from 'mongoose';
import MongooseException from '../../errors/MongooseException';
import IPost from '../../models/posts/IPost';
import BookmarkModel from '../bookmarks/BookmarkModel';
import DislikeModel from '../dislikes/DislikeModel';
import LikeModel from '../likes/LikeModel';
import UserModel from '../users/UserModel';
import { formatJSON } from '../util/formatJSON';

/**
 *  Mongoose database schema for the post resource, based on an {@link IPost} interface.
 */
const PostSchema = new mongoose.Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    post: { type: String, required: true },
    postedDate: { type: Date, required: true, default: Date.now },
    stats: {
      likes: { type: Number, default: 0 },
      replies: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      reposts: { type: Number, default: 0 },
    },
    image: {
      type: String,
      default: '',
    },
    likedBy: [
      { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    ],
    dislikedBy: [
      { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    ],
  },
  { timestamps: true, collection: 'posts' }
);

/**
 * Check if user/author FK is valid before creating post.
 */
PostSchema.pre('save', async function (next) {
  const existingUser = await UserModel.findById(this.author.id);
  if (existingUser === null) {
    throw new MongooseException('Author is not an existing user.');
  }
});
/**
 * Delete all the likes and bookmarks for this post.
 */
PostSchema.post('deleteOne', async function (next) {
  const postId = this.getQuery()._id;
  await LikeModel.deleteMany({ post: postId });
  await DislikeModel.deleteMany({ post: postId });
  await BookmarkModel.deleteMany({ post: postId });
});

formatJSON(PostSchema);
export default PostSchema;
