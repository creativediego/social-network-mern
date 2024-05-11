import { Model } from 'mongoose';
import { IChat } from '../models/chat/IChat';
import { IChatMessage } from '../models/message/IChatMessage';
import { IChatDao } from './IChatDao';
import { ChatType } from '../models/chat/ChatType';
import { DatabaseError } from '../../../common/errors/DatabaseError';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

export class ChatDao implements IChatDao {
  private readonly messageModel: Model<IChatMessage>;
  private readonly chatModel: Model<IChat>;

  /**
   * Constructs the model by setting the dependencies in state: the message model, the chat model, and the error handle.
   * @param {MessageModel} messageModel the Mongoose message model for db operations
   * @param {ChatModel} chatModel the Mongoose chat model for db operations
   * @param {IErrorHandler} errorHandler the error handler to deal with all exceptions
   */
  public constructor(
    messageModel: Model<IChatMessage>,
    chatModel: Model<IChat>
  ) {
    this.messageModel = messageModel;
    this.chatModel = chatModel;

    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Create a chat document by taking an {@link IChat} object and calling the ChatModel. In addition to the native _id of the chat id, also create a chatId field that is a sorted concatenation of all participant ids. This ensure the chat document record is unique to avoid duplicating new chat documents with the same participants.
   * @param chat the chat object with all its data
   * @returns the new chat object after it is created in the ChatModel
   */
  createChat = async (chat: IChat): Promise<IChat> => {
    try {
      let participantsIds = chat.participants.map((user) => user.id);
      let type: ChatType;
      if (chat.participants.length > 2) {
        type = ChatType.Group;
      } else {
        type = ChatType.Private;
      }

      const newChat = {
        ...chat,
        type,
        participants: participantsIds,
        readBy: [chat.creatorId],
        deletedBy: [],
      };

      const existingOrNewChat = await this.chatModel.findOne({
        type,
        participants: { $all: participantsIds },
      });

      if (!existingOrNewChat) {
        return await (
          await this.chatModel.create(newChat)
        ).populate('participants');
      } else {
        return existingOrNewChat;
      }
    } catch (err) {
      throw new DatabaseError('Failed to create chat', err);
    }
  };

  markChatRead = async (userId: string, chatId: string): Promise<IChat> => {
    const updatedChat = await this.chatModel.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        $addToSet: { readBy: userId },
      },
      { new: true }
    );
    if (!updatedChat) {
      throw new DatabaseError('Failed to mark chat as read. Chat not found');
    }
    return updatedChat;
  };

  markMessageRead = async (
    userId: string,
    messageId: string
  ): Promise<IChatMessage> => {
    const updatedMessage = await this.messageModel.findOneAndUpdate(
      {
        _id: messageId,
      },
      {
        $addToSet: { readBy: userId },
      },
      { new: true }
    );
    if (!updatedMessage) {
      throw new DatabaseError(
        'Failed to mark message as read. Message not found.'
      );
    }
    return updatedMessage;
  };

  // Mark the chat as unread by removing all participants from the readBy array except the userId passed in, which corresponds to the user who sent the last message.

  markChatUnread = async (userId: string, chatId: string): Promise<IChat> => {
    const updatedChat = await this.chatModel.findOneAndUpdate(
      {
        _id: chatId,
      },
      {
        readBy: [userId],
        deletedBy: [userId],
      },
      { new: true }
    );
    if (!updatedChat) {
      throw new DatabaseError('Failed to mark chat as unread. Chat not found');
    }
    return updatedChat;
  };

  getUnreadChatIds = async (userId: string): Promise<string[]> => {
    try {
      const chatIds = await this.chatModel
        .find({
          participants: { $elemMatch: { $eq: userId } },
          deletedBy: { $nin: [userId] },
        })
        .distinct('_id');
      return chatIds;
    } catch (err) {
      throw new DatabaseError('Failed to get unread chat ids.', err);
    }
  };

  createMessage = async (message: IChatMessage): Promise<IChatMessage> => {
    try {
      // Create the message.
      const dbMessage = await this.messageModel.create({
        ...message,
        sender: message.sender.id,
      });
      await dbMessage.populate('sender');
      return dbMessage;
    } catch (err) {
      throw new DatabaseError('Failed to create message', err);
    }
  };

  findChatById = async (chatId: string): Promise<IChat | null> => {
    // First, make sure user is a participant in the chat for which they're trying to get all messages from.
    try {
      return await this.chatModel
        .findOne({
          _id: chatId,
        })
        .populate('participants');
    } catch (err) {
      throw new DatabaseError('Failed to find chat', err);
    }
  };

  findMessagesByChatId = async (
    userId: string,
    chatId: string
  ): Promise<IChatMessage[]> => {
    try {
      return await this.messageModel
        .find({
          chatId,
          deletedBy: { $nin: [userId] },
        })
        .sort({ timestamp: -1 }) // Sort messages in descending order based on timestamp (latest first)
        .populate('sender');
    } catch (err) {
      throw new DatabaseError('Failed to find messages by chat.', err);
    }
  };

  getUnreadChatCount = async (userId: string): Promise<number> => {
    try {
      const count = await this.chatModel.countDocuments({
        participants: userId,
        deletedBy: { $nin: [userId] },
      });
      return count;
    } catch (err) {
      throw new DatabaseError('Failed to get unread chat count.', err);
    }
  };

  findInboxMessages = async (userId: string): Promise<IChatMessage[]> => {
    const userObjId = userId;
    try {
      // Aggregate pipeline to fetch messages
      const messages = await this.messageModel.aggregate([
        {
          // Match documents where userId is a participant and not listed in deletedBy
          $match: { deletedBy: { $ne: userObjId }, recipients: userObjId },
        },
        // Sort the messages by creation date, newest first
        { $sort: { createdAt: -1 } },
        {
          // Group messages by chatId, picking the latest message per chat
          $group: {
            _id: '$chatId',
            latestMessage: { $first: '$$ROOT' },
          },
        },
        // Sort groups by the latest message's creation time, newest first
        { $sort: { 'latestMessage.createdAt': -1 } },
        {
          // Join with user collection to fetch sender details
          $lookup: {
            from: 'users', // Assumes your user collection is named 'users'
            localField: 'latestMessage.sender',
            foreignField: '_id',
            as: 'sender',
          },
        },
        // Flatten the sender array to merge sender details into the pipeline
        { $unwind: '$sender' },
        {
          // Select specific fields to shape the final output
          $project: {
            sender: {
              id: '$sender._id',
              name: '$sender.name',
              profilePhoto: '$sender.profilePhoto',
            },
            id: '$latestMessage._id',
            _id: 0, // Exclude MongoDB default _id field from output
            recipients: '$latestMessage.recipients',
            chatId: '$latestMessage.chatId',
            content: '$latestMessage.content',
            deletedBy: '$latestMessage.deletedBy',
            readBy: '$latestMessage.readBy',
            createdAt: '$latestMessage.createdAt',
          },
        },
      ]);
      return messages; // Return the processed message list
    } catch (err) {
      // Handle errors by throwing a custom error with additional info
      throw new DatabaseError('Failed to find inbox messages.', err);
    }
  };

  findMessagesUserSent = async (userId: string): Promise<IChatMessage[]> => {
    try {
      const messages: IChatMessage[] = await this.messageModel.find({
        sender: userId,
      });
      return messages;
    } catch (err) {
      throw new DatabaseError('Failed to find messages user sent.', err);
    }
  };

  deleteMessage = async (
    userId: string,
    messageId: string
  ): Promise<IChatMessage> => {
    try {
      const message = await this.messageModel.findOneAndUpdate(
        {
          _id: messageId,
        },
        {
          $addToSet: { deletedBy: userId }, // only unique entries in the array allowed
        },
        { new: true }
      );
      if (!message) {
        throw new DatabaseError('Message to delete not found.');
      }
      return message;
    } catch (err) {
      throw new DatabaseError('Failed to delete message.', err);
    }
  };

  deleteMessagesByChatId = async (
    userId: string,
    chatId: string
  ): Promise<number> => {
    try {
      const result = await this.messageModel.updateMany(
        {
          chatId,
        },
        {
          $addToSet: { deletedBy: userId },
        },
        { new: true }
      );
      return result.modifiedCount;
    } catch (err) {
      throw new DatabaseError('Failed to delete messages by chat id.', err);
    }
  };

  deleteChat = async (userId: string, chatId: string): Promise<IChat> => {
    try {
      const chat = await this.chatModel.findOneAndUpdate(
        {
          _id: chatId,
        },
        {
          $addToSet: { deletedBy: userId },
        },
        { new: true }
      );
      if (!chat) {
        throw new DatabaseError('Chat to delete not found.');
      }
      await this.messageModel.updateMany(
        {
          chatId,
        },
        {
          $addToSet: { deletedBy: userId },
        }
      );
      return chat;
    } catch (err) {
      throw new DatabaseError('Failed to delete chat.', err);
    }
  };
}
