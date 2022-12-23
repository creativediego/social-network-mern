import { NotificationType } from './NotificationType';
import IUser from './../users/IUser';

/**
 * Model interface for a notification.
 */
export default interface INotification {
  type?: NotificationType;
  content: string;
  userNotified: IUser;
  userActing: IUser;
  resourceId?: string;
  read?: boolean;
}
