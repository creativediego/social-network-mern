import { IChat } from '../models/chat/IChat';
import { IChatMessage } from '../models/message/IChatMessage';

/**
 * Common DAO interface operations for the chat related operations.
 */
export interface IChatDao {
  createChat(conversation: IChat): Promise<IChat>;
  findChatById(chatId: string): Promise<IChat | null>;
  markChatRead(userId: string, chatId: string): Promise<IChat>;
  markChatUnread(userId: string, chatId: string): Promise<IChat>;
  markMessageRead(userId: string, messageId: string): Promise<IChatMessage>;
  createMessage(message: IChatMessage): Promise<IChatMessage>;
  findInboxMessages(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<IChatMessage[]>;
  getUnreadChatCount(userId: string): Promise<number>;
  getUnreadChatIds(userId: string): Promise<string[]>;
  findMessagesUserSent(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<IChatMessage[]>;
  findMessagesByChatId(
    userId: string,
    chatId: string,
    page?: number,
    limit?: number
  ): Promise<IChatMessage[]>;
  deleteChat(userId: string, chatId: string): Promise<IChat>;
  deleteMessage(userId: string, messageId: string): Promise<IChatMessage>;
  deleteMessagesByChatId(userId: string, chatId: string): Promise<number>;
}
