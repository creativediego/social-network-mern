import mongoose, { Schema } from 'mongoose';
import IMessage from '../../models/messages/IMessage';
import UserSchema from '../users/UserSchema';
import { formatJSON } from '../util/formatJSON';

/**
 * A Mongoose message schema that takes an {@link IMessage}. A message contains information about who the sender is, the message, and who has removed/deleted the conversation. When a user deletes a message, it is only removed for that user and not any other participants unless they also choose to remove it.
 * @constructor
 * @param {Schema.Types.ObjectId} sender foreign key of sender ref to {@link UserModel}.
 * @param {Schema.Types.ObjectId} conversation foreign ref to {@link ChatModel}.
 * @param {String} message content
 * @param {Schema.Types.ObjectId[]} array of user foreign keys who deleted the message. Ref to {@link UserModel}.
 * @module MessageSchema
 */
const MessageSchema = new mongoose.Schema<IMessage>(
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
    deletedBy: [
      {
        type: [String],
        default: [],
      },
    ],
    readBy: [
      {
        type: [String],
        default: [],
      },
    ],
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
formatJSON(MessageSchema);
export default MessageSchema;
