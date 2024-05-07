import { NotificationType } from './NotificationType';
import { IUser } from '../../user/models/IUser';

/**
 * Model interface for a notification.
 */
export interface INotification {
  id: string;
  type: NotificationType;
  content: string;
  fromUser: IUser;
  toUser: IUser;
  entityId: string;
  read: boolean;
}
