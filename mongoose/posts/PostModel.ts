import mongoose from 'mongoose';
import IPost from '../../models/posts/IPost';
import PostSchema from './PostSchema';

/**
 * Mongoose database model for the tuit resource that uses a {@link PostSchema}.
 * @module PostModel
 */
export default mongoose.model<IPost>('PostModel', PostSchema);
