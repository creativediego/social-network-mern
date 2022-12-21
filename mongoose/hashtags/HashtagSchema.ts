import mongoose, { Schema } from 'mongoose';
import IHashtag from '../../models/hashtags/IHashtag';
import { formatJSON } from '../util/formatJSON';

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

formatJSON(HashtagSchema);
export default HashtagSchema;
