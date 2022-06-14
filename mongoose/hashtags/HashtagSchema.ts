import mongoose, { Schema } from 'mongoose';
import IHashtag from '../../models/hashtags/IHashtag';
import { formatJSON } from '../util/formatJSON';

const HashtagSchema = new mongoose.Schema<IHashtag>(
  {
    hashtag: { type: String, required: true },
    tuit: { type: Schema.Types.ObjectId, ref: 'TuitModel', required: true },
  },
  {
    timestamps: true,
    collection: 'hashtags',
  }
);

HashtagSchema.index(
  {
    hashtag: 1,
    tuit: 1,
  },
  { unique: true }
);

formatJSON(HashtagSchema);
export default HashtagSchema;
