import mongoose, { Schema } from 'mongoose';
import { IHashtag } from './IHashtag';
import { formatSchemaJSON } from '../../../common/util/formatSchemaJSON';

/**
 * Mongoose schema for the hashtag feature.
 */
const HashtagSchema = new mongoose.Schema<IHashtag>(
  {
    hashtag: { type: String, required: true },
    post: { type: Schema.Types.ObjectId, ref: 'PostModel', required: true },
  },
  {
    timestamps: true,
    collection: 'hashtags',
  }
);

// HashtagSchema.index(
//   {
//     hashtag: 1,
//     post: 1,
//   },
//   { unique: true }
// );

formatSchemaJSON(HashtagSchema);
export default HashtagSchema;
