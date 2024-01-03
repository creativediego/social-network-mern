import IChat from '../../models/messages/IChat';
import IMessage from '../../models/messages/IMessage';

/**
 * Common DAO interface operations for the messages resources.
 */
export default interface IMessageDao {
  createChat(conversation: IChat): Promise<IChat>;
  findChat(chatId: string): Promise<IChat>;
  createMessage(message: IMessage): Promise<IMessage>;
  findInboxMessages(userId: string): Promise<IMessage[]>;
  findMessagesUserSent(userId: string): Promise<IMessage[]>;
  findMessagesByChat(
    userId: string,
    conversationId: string
  ): Promise<IMessage[]>;
  deleteChat(userId: string, chatId: string): Promise<IChat>;
  deleteMessage(userId: string, messageId: string): Promise<IMessage>;
}
