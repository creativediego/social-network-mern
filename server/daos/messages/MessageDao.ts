import { Model } from 'mongoose';
import IChat from '../../models/messages/IChat';
import IMessage from '../../models/messages/IMessage';
import IErrorHandler from '../../errors/IErrorHandler';
import IMessageDao from './IMessageDao';
import { MessageDaoErrors } from './MessageDaoErrors';
import { ChatType } from '../../models/messages/ChatType';

/**
 * DAO database CRUD operations for the messages resources. Implements {@link IMessage}. Takes a {@link MessageModel}, {@link ChatModel}, and {@link IErrorHandler} as injected dependencies.
 */
export default class MessageDao implements IMessageDao {
  private readonly messageModel: Model<IMessage>;
  private readonly chatModel: Model<IChat>;
  private readonly errorHandler: IErrorHandler;

  /**
   * Constructs the model by setting the dependencies in state: the message model, the chat model, and the error handle.
   * @param {MessageModel} messageModel the Mongoose message model for db operations
   * @param {ChatModel} chatModel the Mongoose chat model for db operations
   * @param {IErrorHandler} errorHandler the error handler to deal with all exceptions
   */
  public constructor(
    messageModel: Model<IMessage>,
    chatModel: Model<IChat>,
    errorHandler: IErrorHandler
  ) {
    this.messageModel = messageModel;
    this.chatModel = chatModel;
    this.errorHandler = errorHandler;
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

      const existingChat = await this.chatModel
        .findOne({ type, participants: { $all: participantsIds } })
        .populate('participants');

      if (existingChat) {
        return existingChat;
      }

      const newChat = await this.chatModel.create({
        creatorId: chat.creatorId,
        type,
        participants: participantsIds,
        deletedBy: [],
      });

      const populatedChat = await this.chatModel
        .findById(newChat._id)
        .populate('participants');

      if (populatedChat) {
        return populatedChat;
      } else {
        throw new Error('Failed to populate chat participants');
      }
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_CREATING_CHAT,
        err
      );
    }
  };

  /**
   * Create a new message for an existing chat by using the existing id of the chat this message belongs to. Also interact with the ChatModel to check if sender is a participant in the chat. If so, then call the MessageModel to create the message.
   * @param {string} senderId the send of the message
   * @param {string} message the contents of the message
   * @returns the message document from the MessageModel
   */
  createMessage = async (message: IMessage): Promise<IMessage> => {
    console.log(message);
    // Check if chat for this message exists, and if sender is a participant in it.
    const senderId = message.sender.id;
    try {
      const existingChat = await this.chatModel.findOneAndUpdate(
        {
          _id: message.chatId,
          participants: { $in: [senderId] },
        },
        { new: true }
      );
      if (!existingChat) {
        throw this.errorHandler.objectOrNullException(
          existingChat,
          MessageDaoErrors.INVALID_CHAT
        );
      }
      // Create the message.
      const dbMessage = await this.messageModel.create({
        ...message,
        sender: message.sender.id,
        recipients: existingChat.participants,
      });
      await dbMessage.populate('sender');
      return dbMessage;
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_CREATING_MESSAGE,
        err
      );
    }
  };

  findChat = async (chatId: string): Promise<IChat> => {
    // First, make sure user is a participant in the chat for which they're trying to get all messages from.
    try {
      const existingConvo = await this.chatModel
        .findOne({
          _id: chatId,
        })
        .populate('participants');
      this.errorHandler.objectOrNullException(
        existingConvo,
        MessageDaoErrors.INVALID_CHAT
      );

      return this.errorHandler.objectOrNullException(
        existingConvo,
        MessageDaoErrors.NO_CHAT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_FINDING_CHAT,
        err
      );
    }
  };

  /**
   * Find all messages for chat for the specified user and chat ids. Also check if user if indeed a participant in the chat for security reasons.
   * @param {string} userId the id of the user requesting the messages who should be a participant in the chat
   * @param {string} chatId the id of the chat
   * @returns an array of all {@link IMessage} messages for the chat.
   */
  findMessagesByChat = async (
    userId: string,
    chatId: string
  ): Promise<IMessage[]> => {
    // First, make sure user is a participant in the chat for which they're trying to get all messages from.
    try {
      const existingChat = await this.chatModel.findOneAndUpdate(
        {
          _id: chatId,
          participants: { $in: [userId] },
        },
        {
          $addToSet: { readBy: userId }, // mark convo read. addToSet only unique entries in the array allowed
        }
      );

      this.errorHandler.objectOrNullException(
        existingChat,
        MessageDaoErrors.INVALID_CHAT
      );

      // Retrieve all the messages for the chat.
      const messagesByChat = await this.messageModel
        .find({
          chatId,
          deletedBy: { $nin: [userId] },
        })
        .sort({ timestamp: -1 }) // Sort messages in descending order based on timestamp (latest first)
        .populate('sender');

      this.errorHandler.objectOrNullException(
        messagesByChat,
        MessageDaoErrors.NO_MATCHING_MESSAGES
      );
      return messagesByChat;
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_GETTING_CHAT_MESSAGES,
        err
      );
    }
  };

  /**
   * Finds the latest messages per chat for the specified user. This corresponds what the messages inbox is, where the latest messages are by chat regardless of who sent the last message per chat. Uses the mongo aggregate functionality to filter and sort through chats/messages and to format the the returned output.
   * @param {string} userId the id of the user requesting the latest messages
   * @returns an array of {@link IMessage} latest messages per chat
   */
  findInboxMessages = async (userId: string): Promise<IMessage[]> => {
    try {
      /**
       * Aggregation piping steps to get latest message per chat:
       */
      const messages = await this.messageModel.aggregate([
        // Match messages where userId is in recipients and not in deletedBy
        {
          $match: {
            recipients: userId,
            deletedBy: { $nin: [userId] },
          },
        },

        // Sort messages by createdAt field in descending order (latest first)
        { $sort: { createdAt: -1 } },

        // Group messages by chatId and get the latest message in each chat
        {
          $group: {
            _id: '$chatId',
            latestMessage: { $first: '$$ROOT' },
          },
        },

        // Sort the latest messages by createdAt field in descending order (newest to oldest)
        {
          $sort: { 'latestMessage.createdAt': -1 },
        },

        // Lookup to populate the 'sender' field with data from the 'User' collection
        {
          $lookup: {
            from: 'users', // Replace 'users' with the actual name of your User collection
            localField: 'latestMessage.sender',
            foreignField: '_id',
            as: 'sender',
          },
        },

        // Project to rename _id to id within the sender object
        {
          $addFields: {
            sender: { $arrayElemAt: ['$sender', 0] },
          },
        },

        // Project to shape the output with selected fields, including the populated 'sender'
        {
          $project: {
            sender: {
              id: '$sender._id',
              name: '$sender.name',
              profilePhoto: '$sender.profilePhoto',
            }, // Select the first element from 'sender' array
            id: '$latestMessage._id',
            _id: 0, // exclude
            recipients: '$latestMessage.recipients',
            chatId: '$latestMessage.chatId',
            content: '$latestMessage.content',
            deletedBy: '$latestMessage.deletedBy',
            readBy: '$latestMessage.readBy',
            createdAt: '$latestMessage.createdAt',
            // Add or remove fields as needed for the final output
          },
        },
      ]);

      return messages;
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_RETRIEVING_LAST_CHAT_MESSAGES,
        err
      );
    }
  };

  findMessagesUserSent = async (userId: string): Promise<IMessage[]> => {
    try {
      const messages: IMessage[] = await this.messageModel.find({
        sender: userId,
      });
      return messages;
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_ALL_MESSAGES_SENT_BY_USER,
        err
      );
    }
  };
  /**
   * Remove a message for a particular user by finding the message in the database, and placing the user id in the array of removedFor. The message is not technically deleted, and the user is placed in the array of people for whom the message is no longer visible.
   * @param {string} userId the id of the user requesting to delete the message
   * @param {string} messageId the id of the message
   * @returns the deleted message from the Mongoose model once it has updated
   */
  deleteMessage = async (
    userId: string,
    messageId: string
  ): Promise<IMessage> => {
    try {
      const message = await this.messageModel.findOneAndUpdate(
        {
          _id: messageId,
        },
        {
          $addToSet: { deletedBy: userId }, // only unique entries in the array allowed
        }
      );
      return this.errorHandler.objectOrNullException(
        message,
        MessageDaoErrors.NO_MESSAGE_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_DELETING_MESSAGE,
        err
      );
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
      await this.messageModel.updateMany(
        {
          chatId,
        },
        {
          $addToSet: { deletedBy: userId },
        }
      );
      return this.errorHandler.objectOrNullException(
        chat,
        MessageDaoErrors.NO_CHAT_FOUND
      );
    } catch (err) {
      throw this.errorHandler.handleError(
        MessageDaoErrors.DB_ERROR_DELETING_CHAT,
        err
      );
    }
  };
}
