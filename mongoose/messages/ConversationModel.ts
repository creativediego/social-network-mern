import mongoose from 'mongoose';
import IConversation from '../../models/messages/IConversation';
import ConversationSchema from './ConversationSchema';

/**
 * A Mongoose model for the conversation resource that takes a {@link ConversationSchema}.
 * @module ConversationModel
 */
export default mongoose.model<IConversation>(
  'ConversationModel',
  ConversationSchema
);
