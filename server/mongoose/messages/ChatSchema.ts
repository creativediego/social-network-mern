import mongoose, { Schema } from 'mongoose';
import { ChatType } from '../../models/messages/ChatType';
import IChat from '../../models/messages/IChat';
import { formatJSON } from '../util/formatJSON';

/**
 *
 * A Mongoose conversation schema that takes an {@link IChat}. The schema acts as an intermediate document between users and messages. It contains meta data about a conversation between two users or a group conversation, such as type of conversation, who created it, who the participants are, and who has removed/deleted the entire conversation for themselves, which still remains visible to other users.
 *
 * In addition to the native _id created by MongoDb, the conversationId field ensures the conversation document record is unique to avoid duplicating new conversation documents with the same participants. A DAO working with this schema model is responsible for populating the conversationId with a unique identifier that represents all participants in the conversation, perhaps as a sorted concatenated string of all participants _ids.
 * @constructor
 * @param {ChatType} type the type of this conversation (e.g. PRIVATE or GROUP)
 * @param {Schema.Types.ObjectId} createdBy the user who created the conversation. Ref to {@link UserModel}.
 * @param {Schema.Types.ObjectId} participants the users who are part of this conversation. Ref to {@link UserModel}.
 * @module ConversationSchema
 */
const ChatSchema = new mongoose.Schema<IChat>(
  {
    type: { type: String, enum: ChatType, required: true },
    creatorId: {
      type: String,
      required: true,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
      },
    ],
    deletedBy: [
      {
        type: [String],
      },
    ],
    readBy: [
      {
        type: [String],
      },
    ],
  },
  { timestamps: true, collection: 'chats' }
);

// Create a unique compound index based on 'type' and 'participants'
ChatSchema.index({ type: 1, participants: 1 }, { unique: true });

formatJSON(ChatSchema);
export default ChatSchema;
