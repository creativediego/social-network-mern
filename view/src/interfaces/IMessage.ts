import { IConversation as string } from './IConversation';
import { IUser } from './IUser';

export interface IMessage {
  id: string;
  sender?: IUser;
  conversationId: string;
  message: string;
  removeFor?: IUser[];
  createdAt: string;
}
