import { IUser } from './IUser';

export interface IMessage {
  id: string;
  sender: IUser;
  recipients: string[];
  chatId: string;
  content: string;
  deletedBy: string[];
  readBy: string[];
  createdAt: string;
}
