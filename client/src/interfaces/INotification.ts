import { IUser } from './IUser';

export interface INotification {
  id: string;
  type: string;
  content: string;
  fromUser: IUser;
  toUser: IUser;
  resourceId: string;
  read: boolean;
  createdAt: string;
}
