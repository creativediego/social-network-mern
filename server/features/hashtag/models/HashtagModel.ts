import mongoose from 'mongoose';
import { IHashtag } from './IHashtag';
import HashtagSchema from './HashtagSchema';

/**
 * Mongoose model for the hashtag feature.
 */
export default mongoose.model<IHashtag>('HashtagModel', HashtagSchema);
