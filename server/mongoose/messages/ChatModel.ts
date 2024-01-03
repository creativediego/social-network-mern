import mongoose from 'mongoose';
import IChat from '../../models/messages/IChat';
import ChatSchema from './ChatSchema';

/**
 * A Mongoose model for the conversation resource that takes a {@link ChatSchema}.
 * @module ChatModel
 */
export default mongoose.model<IChat>('ChatModel', ChatSchema);
