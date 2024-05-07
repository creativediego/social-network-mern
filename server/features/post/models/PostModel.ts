import mongoose from 'mongoose';
import { IPost } from './IPost';
import PostSchema from './PostSchema';

/**
 * Mongoose database model for the post resource that uses a {@link PostSchema}.
 * @module PostModel
 */
export default mongoose.model<IPost>('PostModel', PostSchema);
