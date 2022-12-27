import IConversation from '../../models/messages/IConversation';
import IMessage from '../../models/messages/IMessage';

/**
 * Common DAO interface operations for the messages resources.
 */
export default interface IMessageDao {
  createConversation(conversation: IConversation): Promise<IConversation>;
  findConversation(conversationId: string): Promise<IConversation>;
  createMessage(sender: string, message: IMessage): Promise<IMessage>;
  findLatestMessagesByUser(userId: string): Promise<IMessage[]>;
  findAllMessagesSentByUser(userId: string): Promise<IMessage[]>;
  findAllMessagesByConversation(
    userId: string,
    conversationId: string
  ): Promise<IMessage[]>;
  deleteConversation(
    userId: string,
    conversationId: string
  ): Promise<IConversation>;
  deleteMessage(userId: string, messageId: string): Promise<IMessage>;
}
