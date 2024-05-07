import IChatController from './IChatController';
import { IChatDao } from '../daos/IChatDao';
import { IChatMessage } from '../models/message/IChatMessage';
import { IHttpRequest } from '../../../common/interfaces/IHttpRequest';
import { IHttpResponse } from '../../../common/interfaces/IHttpResponse';
import {
  notFoundResponse,
  okResponse,
} from '../../../common/util/httpResponses';
import { IChat } from '../models/chat/IChat';
import { IChatService } from '../services/IChatService';
import { ILogger } from '../../../common/logger/ILogger';
import { ControllerError } from '../../../common/errors/ControllerError';

/**
 * Represents an implementation of an {@link IChatController}
 */
export default class MessageController implements IChatController {
  private readonly chatService: IChatService;
  private readonly logger: ILogger;

  /**
   * Constructs the message controller with a message dao dependency that implements {@link IChatDao}.
   * @param messageDao the message dao
   */
  public constructor(chatService: IChatService, logger: ILogger) {
    this.chatService = chatService;
    this.logger = logger;
    Object.freeze(this); // Make this object immutable.
  }

  getUnreadChatCount = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<number>> => {
    const userId = req.user.id;
    const count = await this.chatService.getUnreadChatCount(userId);
    return okResponse(count);
  };

  getUnreadChatIds = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<string[]>> => {
    const userId = req.user.id;
    const ids = await this.chatService.getUnreadChatIds(userId);
    return okResponse(ids);
  };

  /**
   * Processes request and response of creating a new chat, which will be associated with a message. Calls the message dao to create the chat using with meta data, such as who created the chats, the participants, and the type of chat. Sends the new chat object back to the client.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  createChat = async (req: IHttpRequest): Promise<IHttpResponse<IChat>> => {
    const newChat = await this.chatService.createChat(req.body);
    this.logger.info(`User ${req.user.username} created chat ${newChat.id}`);
    return okResponse(newChat);
  };

  findChatById = async (req: IHttpRequest): Promise<IHttpResponse<IChat>> => {
    const chat = await this.chatService.findChatById(req.params.chatId);
    if (!chat) {
      return notFoundResponse(
        new ControllerError(`Chat ${req.params.chatId} not found.`)
      );
    }
    this.logger.info(`User ${req.user.username} fetched chat ${chat.id}`);
    return okResponse(chat);
  };

  /**
   * Processes the request and response of creating a new message sent by the specified user. The request body specifies the chat the message belongs to. Message dao is called to create the message, which is then sent back to the client.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  createMessage = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IChatMessage>> => {
    const newMessage: IChatMessage = await this.chatService.createMessage(
      req.body
    );

    this.logger.info(
      `User ${req.user.username} created message ${newMessage.id}`
    );
    return okResponse(newMessage);
  };

  markMessageRead = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IChatMessage>> => {
    const updatedMessage = await this.chatService.markMessageRead(
      req.user.id,
      req.params.messageId
    );
    return okResponse(updatedMessage);
  };

  /**
   * Processes request and response of finding all messages associated with a user and a chat. Calls the message dao to find such messages using the user and chat ids. Sends back an array of messages back to the client.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  findMessagesByChat = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IChatMessage[]>> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const messages = await this.chatService.findMessagesByChat(
      req.user.id,
      req.params.chatId,
      page,
      limit
    );

    this.logger.info(
      `User ${req.user.username} fetched messages for chat ${req.params.chatId}`
    );
    return okResponse(messages);
  };

  /**
   * Processes request and response of finding the latest messages for each chat the specified user currently has with the help of the messages dao. Sends back an array with the latest messages to the client.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  findInboxMessages = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IChatMessage[]>> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 100;
    const userId = req.user.id;
    const messages: any = await this.chatService.findInboxMessages(
      userId,
      page,
      limit
    );

    this.logger.info(`User ${req.user.username} fetched inbox messages.`);
    return okResponse(messages);
  };

  /**
   * Processes request and response of removing a message for the specified user by calling the message dao and passing the user and message id. Sends back the message that was deleted back to the client.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  deleteMessage = async (
    req: IHttpRequest
  ): Promise<IHttpResponse<IChatMessage>> => {
    const deletedMessage: IChatMessage = await this.chatService.deleteMessage(
      req.user.id,
      req.params.messageId
    );
    return okResponse(deletedMessage);
  };

  /**
   * Processes request and response of removing a chat for the specified user by passing user and chat id to the message dao. Sends the deleted chat back to the client.
   * @param {IHttpRequest} req the request data containing client data
   * @returns {IHttpResponse} the response data to be sent to the client
   */
  deleteChat = async (req: IHttpRequest): Promise<IHttpResponse<IChat>> => {
    const deletedChat: IChat = await this.chatService.deleteChat(
      req.user.id,
      req.params.chatId
    );
    return okResponse(deletedChat);
  };
}
