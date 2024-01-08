import mongoose, { Schema } from 'mongoose';
import MongooseException from '../../errors/MongooseException';
import { NotificationType } from '../../models/notifications/NotificationType';
import { INotification } from '../../models/notifications/INotification';
import { formatJSON } from '../util/formatJSON';

/**
 * Mongoose schema for the notifications resource that takes an {@link INotifications} object.
 * The schema contains a user foreign key reference. All fields are required, and created/updated time stamps are added.
 * @constructor LikeSchema
 * @param {String} type type of notification a user is receiving
 * @param {String} notificationString string representing the content of the notification
 * @param {Schema.Types.ObjectId} post the post foreign key
 * @param {Boolean} read has the notification been read?
 * @module LikeSchema
 */
const NotificationSchema = new mongoose.Schema<INotification>(
  {
    type: { type: String, enum: NotificationType, required: true },
    content: { type: String },
    entityId: { type: String, required: true },
    toUser: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'UserModel',
      required: true,
    },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: 'notifications',
  }
);
// Create a unique compound index based on 'userNotified' and 'userActing'
// This works by creating a unique index on the combination of the two fields.
// This will prevent a user from liking a post more than once.
NotificationSchema.index(
  { type: 1, userActing: 1, userNotified: 1 },
  { unique: true }
);

formatJSON(NotificationSchema);
export default NotificationSchema;
