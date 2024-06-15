import { IChat } from '../models/chat/IChat';
import { IChatMessage } from '../models/message/IChatMessage';

/**
 * Common service interface operations for the chat related operations.
 */
export interface IChatService {
  createChat(chat: IChat): Promise<IChat>;
  findChatById(chatId: string): Promise<IChat | null>;
  createMessage(message: IChatMessage): Promise<IChatMessage>;
  markMessageRead(userId: string, messageId: string): Promise<IChatMessage>;
  getUnreadChatCount(userId: string): Promise<number>;
  getUnreadChatIds(userId: string): Promise<string[]>;
  findInboxMessages(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<IChatMessage[]>;
  findMessagesByChat(
    userId: string,
    chatId: string,
    page?: number,
    limit?: number
  ): Promise<IChatMessage[]>;
  deleteChat(userId: string, chatId: string): Promise<IChat>;
  deleteMessage(userId: string, messageId: string): Promise<IChatMessage>;
}
