import { Model } from 'mongoose';
import { INotification } from '../models/INotification';
import NotificationModel from '../models/NotificationModel';
import { NotificationType } from '../models/NotificationType';
import { DatabaseError } from '../../../common/errors/DatabaseError';

/**
 * Interface for the Notification DAO. Contains methods for CRUD operations on the notifications resource.
 */
export interface INotificationDao {
  findNotification(
    type: NotificationType,
    fromUser: string,
    toUser: string
  ): Promise<INotification | null>;
  countNotifications(userId: string): Promise<number>;
  findAllNotifications(userId: string): Promise<INotification[]>;
  findAllUnreadNotifications(userId: string): Promise<INotification[]>;
  createNotification(
    type: NotificationType,
    fromUserId: string,
    toUserId: string
  ): Promise<INotification>;
  markNotificationRead(nid: string): Promise<INotification>;
  deleteNotification(nid: string): Promise<number>;
}

/**
 * DAO database CRUD operations for the notifications resource. Takes the injected dependencies of a {@link Model<INotification>} ORM model.
 */
export class NotificationDao implements INotificationDao {
  private notificationModel: Model<INotification>;

  public constructor(notificationModel: Model<INotification>) {
    this.notificationModel = NotificationModel;
  }

  findNotification = async (
    type: NotificationType,
    fromUser: string,
    toUser: string
  ): Promise<INotification | null> =>
    await this.notificationModel.findOne({
      type,
      fromUser,
      toUser,
    });

  /**
   * Finds all notifications belonging to a user id in the database. Populates the userNotified and fromUser.
   * @param {string} userId the id of the user receiving notifications.
   * @returns an array of all notifications for the user id
   */
  findAllNotifications = async (userId: string): Promise<INotification[]> =>
    NotificationModel.find({ toUser: userId })
      .populate('toUser')
      .populate('fromUser')
      .exec();

  countNotifications = async (userId: string): Promise<number> =>
    await NotificationModel.countDocuments({
      toUser: userId,
      read: false,
    });

  /**
   * Finds all unread notifications belonging to a user id in the database.
   * @param {string} userId the id of the user recieving notifications.
   * @returns an array of all unread notifications for the user id
   */
  findAllUnreadNotifications = async (
    userId: string
  ): Promise<INotification[]> =>
    await NotificationModel.find({
      toUser: userId,
      read: false,
    }).populate('fromUser');

  /**
   * Creates a notification for a given user
   * @param notificationType string representing the content of notification such as a message, like, or follow
   * @param uid string represents the user id of the user being notified
   * @param uid2 string represents the user id of the user that did the action
   * @returns the notification entry inserted into the databse
   */
  createNotification = async (
    type: NotificationType,
    fromUser: string,
    toUser: string
  ): Promise<INotification> => {
    const dbNotification = NotificationModel.findOneAndUpdate(
      {
        type,
        fromUser,
        toUser,
      },
      {},
      {
        upsert: true,
        new: true,
      }
    )
      .populate('fromUser')
      .populate('toUser');
    return dbNotification;
  };

  /**
   * Marks a notification as read.
   * @param nid
   * @returns notification that has been updated
   */
  markNotificationRead = async (nid: string): Promise<INotification> => {
    const notification = await NotificationModel.findOneAndUpdate(
      { _id: nid },
      { read: true },
      { new: true }
    ).populate('fromUser');
    if (!notification) {
      throw new DatabaseError(
        'Cannot mark notification read: Notification not found.'
      );
    }
    return notification;
  };

  /**
   * Deletes a notification
   * @param nid id of the notification to be deleted
   * @returns status of deleting
   */
  deleteNotification = async (nid: string): Promise<number> => {
    const deleted = await NotificationModel.deleteOne({ id: nid });
    return deleted.deletedCount;
  };
}
