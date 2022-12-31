import IUser from '../users/IUser';
import IConversation from './IConversation';

/**
 * Model interface for a message.
 */
export default interface IMessage {
  sender?: IUser;
  conversation: IConversation;
  message: string;
  removeFor?: IUser[];
  // readFor?: IUser[];
}
