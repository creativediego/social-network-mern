import HttpRequest from '../shared/HttpRequest';
import HttpResponse from '../shared/HttpResponse';
import { Express, Router } from 'express';
import { adaptRequest } from '../shared/adaptRequest';
import { okResponse as okResponse } from '../shared/createResponse';
import { isAuthenticated } from '../auth/isAuthenticated';
import INotification from '../../models/notifications/INotification';
import NotificationDao from '../../daos/notifications/NotificationsDao';
import { Server } from 'socket.io';
import { ISocketService } from '../../services/ISocketService';
/**
 * Represents the implementation for handling the notifications resource api.
 * @class
 */
export default class NotificationController {
  private readonly notificationDao: NotificationDao;
  private readonly socketService: ISocketService;

  /** Constructs the notifications controller with an notificationDao implementation. Defines the endpoint paths, middleware, method types, and handler methods associated with each endpoint.
   *
   * @param {NotificationDao} notification a notification dao used to find notifications resources in the database.
   */
  constructor(
    path: string,
    app: Express,
    notificationDao: NotificationDao,
    socketServer: ISocketService
  ) {
    this.notificationDao = notificationDao;
    this.socketService = socketServer;
    const router = Router();
    router.get(
      '/notifications',
      isAuthenticated,

      adaptRequest(this.findAllNotifications)
    );
    router.get(
      '/users/:userId/notifications',
      isAuthenticated,

      adaptRequest(this.findNotifications)
    );
    router.post(
      '/users/:userId/notifications',
      isAuthenticated,
      adaptRequest(this.createNotification)
    );
    router.get(
      '/users/:userId/notifications/unread',
      isAuthenticated,

      adaptRequest(this.findUnreadNotifications)
    );
    router.put(
      '/notifications/:nid/read',
      isAuthenticated,
      adaptRequest(this.updateNotificationAsRead)
    );
    app.use(path, router);
    Object.freeze(this); // Make this object immutable.
  }

  /**
   * Processes the endpoint request of creating a notification by calling the notificationDao,
   * which will create and return a notification document. Also emits a NEW_NOTIFICATION message
   * to the recipient's socket server. This will allow their notifications page to be automatically
   * updated.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  createNotification = async (req: HttpRequest): Promise<HttpResponse> => {
    const userNotifiedId = req.params.userId;

    const notification: INotification =
      await this.notificationDao.createNotification(req.body);

    // Emit an update to the socket server that there's a new like notification

    this.socketService.emitToRoom(
      req.body.userNotified,
      'NEW_NOTIFICATION',
      notification
    );
    // new notification
    return okResponse(notification);
  };

  /**
   * Processes the request of finding all all notifications for a particular user.
   * Calls the notifications dao to find the notifications, and returns the notifications back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findNotifications = async (req: HttpRequest): Promise<HttpResponse> => {
    const notifications: INotification[] =
      await this.notificationDao.findAllNotificationsForUser(req.params.userId);
    return okResponse(notifications.reverse());
  };

  /**
   * Processes the request of finding all all notifications in the database (used for testing).
   * Calls the notifications dao to find the notifications, and returns the notifications back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findAllNotifications = async (req: HttpRequest): Promise<HttpResponse> => {
    const notifications: INotification[] =
      await this.notificationDao.findAllNotifications();
    return okResponse(notifications);
  };

  /**
   * Processes of updating a notification to mark it as read by calling the dao with the notification id.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  updateNotificationAsRead = async (
    req: HttpRequest
  ): Promise<HttpResponse> => {
    const nid = req.params.nid;
    const readNotification = await this.notificationDao.updateReadNotification(
      nid
    );

    // Send a message to the socket listener for the notified user to recieve the new notification
    this.socketService.emitToRoom(nid, 'NEW_NOTIFICATION', readNotification);
    return okResponse(readNotification);
  };

  /**
   * Processes the request of finding all unread notifications for a particular user.
   * Calls the notifications dao to find the unread notifications, and returns the unread notifications back to the client.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  findUnreadNotifications = async (req: HttpRequest): Promise<HttpResponse> => {
    const undreadNotifications: INotification[] =
      await this.notificationDao.findUnreadNotificationsForUser(
        req.params.userId
      );
    return okResponse(undreadNotifications);
  };

  /**
   * Processes the request of deleting a given notification.
   * @param {HttpRequest} req the request data containing client data
   * @returns {HttpResponse} the response data to be sent to the client
   */
  deleteNotification = async (req: HttpRequest): Promise<HttpResponse> => {
    const nid = req.params.nid;
    const deleteStatus = await this.notificationDao.deleteNotification(nid);
    return okResponse(deleteStatus);
  };
}
