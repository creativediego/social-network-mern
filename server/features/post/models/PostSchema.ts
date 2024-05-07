import mongoose, { Schema } from 'mongoose';
import { IPost } from './IPost';
import { formatSchemaJSON } from '../../../common/util/formatSchemaJSON';

/**
 *  Mongoose database schema for the post resource, based on an {@link IPost} interface.
 */
const PostSchema = new mongoose.Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    post: {
      type: String,
      required: true,
      match: /^.{1,280}$/,
    },
    stats: {
      likes: { type: Number, default: 0 },
      replies: { type: Number, default: 0 },
      dislikes: { type: Number, default: 0 },
      reposts: { type: Number, default: 0 },
    },
    image: {
      type: String,
      default: '',
      match: /^((http|https):\/\/[^ "]+)?$/,
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

// PostSchema.post('findOne', function () {
//   this.populate('author');
// });

// PostSchema.virtual('id').get(function () {
//   return this._id.toHexString(); // Convert ObjectId to a hexadecimal string
// });

formatSchemaJSON(PostSchema);
export default PostSchema;
