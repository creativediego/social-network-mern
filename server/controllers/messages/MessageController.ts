import IMessageController from './IMessageController';
import IMessageDao from '../../daos/messages/IMessageDao';
import IMessage from '../../models/messages/IMessage';
import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';
import { okResponse } from '../shared/createResponse';
import { isAuthenticated } from '../auth/isAuthenticated';
import { ISocketService } from '../../services/ISocketService';
import IChat from '../../models/messages/IChat';

/**
 * Represents an implementation of an {@link IMessageController}
 */
export default class MessageController implements IMessageController {
  private readonly messageDao: IMessageDao;
  private readonly socketService: ISocketService;

  /**
   * Constructs the message controller with a message dao dependency that implements {@link IMessageDao}.
   * @param messageDao the message dao
   */
  public constructor(
    path: string,
    app: Express,
    messageDao: IMessageDao,
    socketService: ISocketService
  ) {
    this.messageDao = messageDao;
    this.socketService = socketService;
    const router: Router = Router();

    router.get('/:chatId', isAuthenticated, adaptRequest(this.findChat));

    router.post('/', isAuthenticated, adaptRequest(this.createChat));

    router.delete('/:chatId', isAuthenticated, adaptRequest(this.deleteChat));

    router.get(
      '/:chatId/messages',
      isAuthenticated,
      adaptRequest(this.findMessagesByChat)
    );

    router.get(
      '/messages/inbox',
      isAuthenticated,
      adaptRequest(this.findInboxMessages)
    );

    router.get(
      '/messages/sent',
      isAuthenticated,
      adaptRequest(this.findMessagesUserSent)
    );

    router.post(
      '/:chatId/messages',
      isAuthenticated,
      adaptRequest(this.createMessage)
    );

    router.delete(
      '/:chatId/messages/:messageId',
      isAuthenticated,
      adaptRequest(this.deleteMessage)
    );

    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Processes request and response of creating a new chat, which will be associated with a message. Calls the message dao to create the chat using with meta data, such as who created the chats, the participants, and the type of chat. Sends the new chat object back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  createChat = async (req: HttpRequest): Promise<HttpResponse> => {
    console.log(req.body);
    const newChat = await this.messageDao.createChat(req.body);
    return okResponse(newChat);
  };

  findChat = async (req: HttpRequest): Promise<HttpResponse> => {
    const chat = await this.messageDao.findChat(req.params.chatId);
    return okResponse(chat);
  };

  /**
   * Processes the request and response of creating a new message sent by the specified user. The request body specifies the chat the message belongs to. Message dao is called to create the message, which is then sent back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  createMessage = async (req: HttpRequest): Promise<HttpResponse> => {
    const message: IMessage = {
      sender: req.user,
      chatId: req.params.chatId,
      content: req.body.content,
      recipients: [],
    };

    const newMessage: IMessage = await this.messageDao.createMessage(message);

    // Emit to client sockets
    const recipientIds = newMessage.recipients;
    for (const recipientId of recipientIds) {
      this.socketService.emitToRoom(recipientId, 'NEW_MESSAGE', newMessage);
    }
    return okResponse(newMessage);
  };

  /**
   * Processes request and response of finding all messages associated with a user and a chat. Calls the message dao to find such messages using the user and chat ids. Sends back an array of messages back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findMessagesByChat = async (req: HttpRequest): Promise<HttpResponse> => {
    const messages = await this.messageDao.findMessagesByChat(
      req.user.id,
      req.params.chatId
    );
    return okResponse(messages);
  };

  /**
   * Processes request and response of finding the latest messages for each chat the specified user currently has with the help of the messages dao. Sends back an array with the latest messages to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findInboxMessages = async (req: HttpRequest): Promise<HttpResponse> => {
    const userId = req.user.id;
    const messages: any = await this.messageDao.findInboxMessages(userId);
    return okResponse(messages);
  };

  findMessagesUserSent = async (req: HttpRequest): Promise<HttpResponse> => {
    const messages: IMessage[] = await this.messageDao.findMessagesUserSent(
      req.user.id
    );
    return okResponse(messages);
  };

  /**
   * Processes request and response of removing a message for the specified user by calling the message dao and passing the user and message id. Sends back the message that was deleted back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  deleteMessage = async (req: HttpRequest): Promise<HttpResponse> => {
    const deletedMessage: IMessage = await this.messageDao.deleteMessage(
      req.user.id,
      req.params.messageId
    );
    return okResponse(deletedMessage);
  };

  /**
   * Processes request and response of removing a chat for the specified user by passing user and chat id to the message dao. Sends the deleted chat back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  deleteChat = async (req: HttpRequest): Promise<HttpResponse> => {
    const deletedChat: IChat = await this.messageDao.deleteChat(
      req.user.id,
      req.params.chatId
    );
    return okResponse(deletedChat);
  };
}
