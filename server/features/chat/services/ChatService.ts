import { ServiceError } from '../../../common/errors/ServiceError';
import { ISocketService } from '../../socket/services/ISocketService';
import { SocketEvents } from '../../socket/services/SocketEvents';
import { IChatDao } from '../daos/IChatDao';
import { IChat } from '../models/chat/IChat';
import { IChatMessage } from '../models/message/IChatMessage';
import { IChatService } from './IChatService';

export class ChatService implements IChatService {
  private readonly chatDao: IChatDao;
  private readonly socketService: ISocketService;

  public constructor(chatDao: IChatDao, socketService: ISocketService) {
    this.chatDao = chatDao;
    this.socketService = socketService;
    Object.freeze(this);
  }

  public findChatById = async (chatId: string): Promise<IChat | null> =>
    await this.chatDao.findChatById(chatId);

  public createChat = async (chat: IChat): Promise<IChat> =>
    await this.chatDao.createChat(chat);

  public getUnreadChatCount = async (userId: string): Promise<number> =>
    await this.chatDao.getUnreadChatCount(userId);

  public getUnreadChatIds = async (userId: string): Promise<string[]> =>
    await this.chatDao.getUnreadChatIds(userId);

  public createMessage = async (
    message: IChatMessage
  ): Promise<IChatMessage> => {
    const existingChat = await this.chatDao.findChatById(message.chatId);
    if (!existingChat) {
      throw new ServiceError(
        'Cannot create message because chat does not exist.'
      );
    }
    const userIsParticipant = existingChat.participants.some((participant) => {
      return participant.id === message.sender.id;
    });

    if (!userIsParticipant) {
      throw new ServiceError(
        'Cannot create message because user is not a participant in the chat.'
      );
    }
    const newMessage = await this.chatDao.createMessage(message);
    // mark chat unread. that is, mark the chat as being read only by the sender
    await this.chatDao.markChatUnread(message.sender.id, message.chatId);

    // Emit to client sockets
    const recipientIds = newMessage.recipients;
    console.log('RECIPIENT Ids', recipientIds);
    for (const recipientId of recipientIds) {
      if (recipientId !== message.sender.id) {
        this.socketService.emitToUser(
          recipientId,
          SocketEvents.NEW_MESSAGE,
          newMessage
        );
      }
    }
    return newMessage;
  };

  markMessageRead = async (
    userId: string,
    messageId: string
  ): Promise<IChatMessage> => {
    // mark message as read
    const message = await this.chatDao.markMessageRead(userId, messageId);
    // mark chat as read
    await this.chatDao.markChatRead(userId, message.chatId);
    return message;
  };

  public findInboxMessages = async (
    userId: string,
    page?: number | undefined,
    limit?: number | undefined
  ): Promise<IChatMessage[]> =>
    await this.chatDao.findInboxMessages(userId, page, limit);

  public findMessagesByChat = async (
    userId: string,
    chatId: string,
    page?: number | undefined,
    limit?: number | undefined
  ): Promise<IChatMessage[]> => {
    const messages = await this.chatDao.findMessagesByChatId(
      userId,
      chatId,
      page,
      limit
    );
    // Mark chat as read
    await this.chatDao.markChatRead(userId, chatId);
    // Mark last message as read
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      await this.chatDao.markMessageRead(userId, lastMessage.id);
    }
    return messages;
  };

  public deleteChat = async (
    userId: string,
    chatId: string
  ): Promise<IChat> => {
    const deletedChat = await this.chatDao.deleteChat(userId, chatId);
    const deletedMessageCount = await this.chatDao.deleteMessagesByChatId(
      userId,
      chatId
    );
    return deletedChat;
  };

  public deleteMessage(
    userId: string,
    messageId: string
  ): Promise<IChatMessage> {
    const deletedMessage = this.chatDao.deleteMessage(userId, messageId);
    this.socketService.emitToUser(
      userId,
      SocketEvents.DELETE_MESSAGE,
      deletedMessage
    );
    return deletedMessage;
  }
}
