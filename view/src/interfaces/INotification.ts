import { IUser } from './IUser';

export interface INotification {
  id: string;
  type: string;
  content: string;
  userNotified: IUser;
  userActing: IUser;
  resourceId?: string;
  read: string;
}
