import { IConversation } from './IConversation';
import { IUser } from './IUser';

export interface IMessage {
  sender?: IUser;
  conversation: IConversation;
  message: string;
  removeFor?: IUser[];
}
