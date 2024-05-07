import mongoose from 'mongoose';
import { INotification } from './INotification';
import NotificationSchema from './NotificationSchema';

/**
 * Mongoose database model for the notifications resource. Uses a {@link NotifcationSchema}.
 * @module NotificationModel
 */
export default mongoose.model<INotification>(
  'NotificationModel',
  NotificationSchema
);
