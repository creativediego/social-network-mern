import mongoose from 'mongoose';
import { IHashtag } from './IHashtag';
import HashtagSchema from './HashtagSchema';

export default mongoose.model<IHashtag>('HashtagModel', HashtagSchema);
