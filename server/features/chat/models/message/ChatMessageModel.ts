import mongoose from 'mongoose';
import { IChatMessage } from './IChatMessage';
import ChatMessageSchema from './ChatMessageSchema';

/**
 * A Mongoose model for the message resource that takes a {@link ChatMessageSchema}.
 * @module MessageModel
 */
export default mongoose.model<IChatMessage>(
  'ChatMessageModel',
  ChatMessageSchema
);
