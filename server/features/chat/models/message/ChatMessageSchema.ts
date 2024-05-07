import mongoose, { Schema } from 'mongoose';
import { IChatMessage } from './IChatMessage';
import UserSchema from '../../../user/models/UserSchema';
import { formatSchemaJSON } from '../../../../common/util/formatSchemaJSON';

/**
 * A Mongoose message schema that takes an {@link IChatMessage}. A message contains information about who the sender is, the message, and who has removed/deleted the conversation. When a user deletes a message, it is only removed for that user and not any other participants unless they also choose to remove it.
 * @constructor
 * @param {Schema.Types.ObjectId} sender foreign key of sender ref to {@link UserModel}.
 * @param {Schema.Types.ObjectId} conversation foreign ref to {@link ChatModel}.
 * @param {String} message content
 * @param {Schema.Types.ObjectId[]} array of user foreign keys who deleted the message. Ref to {@link UserModel}.
 * @module ChatMessageSchema
 */
const ChatMessageSchema = new mongoose.Schema<IChatMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'UserModel', required: true },
    chatId: {
      type: String,
      required: true,
    },
    recipients: {
      type: [String],
      required: true,
    },
    content: { type: String, required: true },
    deletedBy: {
      type: [String],
      required: true,
    },
    readBy: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true, collection: 'messages' }
);

// MessageSchema.index(
//   {
//     sender: 1,
//     recipient: 1,
//     chatId: 1,
//   },
//   { unique: true }
// );
formatSchemaJSON(ChatMessageSchema);
export default ChatMessageSchema;
