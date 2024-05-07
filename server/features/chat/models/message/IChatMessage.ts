import { IUser } from '../../../user/models/IUser';

/**
 * Model interface for a message.
 */
export interface IChatMessage {
  id: string;
  sender: IUser;
  chatId: string;
  content: string;
  recipients: string[];
  deletedBy: string[];
  readBy: string[];
}
