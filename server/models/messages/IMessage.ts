import IUser from '../users/IUser';

/**
 * Model interface for a message.
 */
export default interface IMessage {
  sender: IUser;
  recipients: string[];
  chatId: string;
  content: string;
  deletedBy?: string[];
  readBy?: string[];
}
