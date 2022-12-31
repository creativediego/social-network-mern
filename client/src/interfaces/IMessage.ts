import { IConversation } from './IConversation';
import { IUser } from './IUser';

export interface IMessage {
  id: string;
  sender?: IUser;
  recipients: IUser[];
  conversationId?: string;
  conversation: IConversation;
  message: string;
  removeFor?: IUser[];
  readFor?: string[];
  createdAt: string;
}
