import mongoose from 'mongoose';
import IHashtag from '../../models/hashtags/IHashtag';
import HashtagSchema from './HashtagSchema';

export default mongoose.model<IHashtag>('HashtagModel', HashtagSchema);
