import { IUser } from './IUser';

export interface IMessage {
  id: string;
  sender: IUser;
  recipients: [];
  chatId: string;
  content: string;
  deletedBy: string[];
  readBy: string[];
  createdAt: string;
}
