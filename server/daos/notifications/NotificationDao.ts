import { Model } from 'mongoose';
import { INotification } from '../../models/notifications/INotification';
import NotificationModel from '../../mongoose/notifications/NotificationModel';
import { NotificationType } from '../../models/notifications/NotificationType';

export interface INotificationDao {
  findNotification(
    type: NotificationType,
    fromUser: string,
    toUser: string
  ): Promise<INotification | null>;
  findAllNotifications(userId: string): Promise<INotification[]>;
  findAllUnreadNotifications(userId: string): Promise<INotification[]>;
  createNotification(
    type: NotificationType,
    fromUserId: string,
    toUserId: string
  ): Promise<INotification>;
  markNotificationRead(nid: string): Promise<INotification>;
  deleteNotification(nid: string): Promise<INotification>;
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
      .populate('userNotified')
      .populate('userActing')
      .exec();

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
  markNotificationRead = async (nid: string): Promise<any> =>
    await NotificationModel.findOneAndUpdate(
      { _id: nid },
      { read: true },
      { new: true }
    ).populate('fromUser');

  /**
   * Deletes a notification
   * @param nid id of the notification to be deleted
   * @returns status of deleting
   */
  deleteNotification = async (nid: string): Promise<any> =>
    await NotificationModel.deleteOne({ id: nid });
}
