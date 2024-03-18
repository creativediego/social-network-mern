/**
 * @file Middle tier for notifictions resource.
 * Provides a service to communicate with the restful API of the server.
 */

import axios from 'axios';
import { INotification } from '../interfaces/INotification';
import { urlConfig } from '../config/appConfig';
import { APIServiceI, ReqType, apiService } from './APIService';

const NOTIFICATIONS_API = `${urlConfig.apiURL}/notifications`;
const USERS_API = `${urlConfig.apiURL}/users`;

interface INotificationService {
  findNotifications: (userId: string) => Promise<INotification[]>;
  createNotification: (
    userId: string,
    notification: INotification
  ) => Promise<INotification>;
  markNotificationAsRead: (nid: string) => Promise<INotification>;
  findUnreadNotifications: (userId: string) => Promise<INotification[]>;
}

class NotificationServiceImpl implements INotificationService {
  private notificationsAPI: string;
  private usersAPI: string;
  private APIService: APIServiceI;

  private constructor(
    notificationsAPI: string,
    usersAPI: string,
    apiService: APIServiceI
  ) {
    this.notificationsAPI = notificationsAPI;
    this.usersAPI = usersAPI;
    this.APIService = apiService;
    Object.freeze(this);
  }

  public static getInstance(
    notificationsAPI: string,
    usersAPI: string,
    APIService: APIServiceI
  ): NotificationServiceImpl {
    return new NotificationServiceImpl(notificationsAPI, usersAPI, APIService);
  }

  public findNotifications = async (userId: string) => {
    const url = `${this.usersAPI}/${userId}/notifications`;
    return await this.APIService.makeRequest<INotification[]>(
      url,
      ReqType.GET,
      'Error fetching notifications. Try again later.'
    );
  };

  public createNotification = async (
    userId: string,
    notification: INotification
  ) => {
    const url = `${this.usersAPI}/${userId}/notifications`;
    return await this.APIService.makeRequest<INotification, INotification>(
      url,
      ReqType.POST,
      'Error creating notification. Try again later.',
      notification
    );
  };

  public markNotificationAsRead = async (nid: string) => {
    const url = `${this.notificationsAPI}/${nid}/read`;
    return await this.APIService.makeRequest<INotification>(
      url,
      ReqType.PUT,
      'Error marking notification as read. Try again later.'
    );
  };

  public findUnreadNotifications = async (userId: string) => {
    const url = `${this.usersAPI}/${userId}/notifications/unread`;
    return await this.APIService.makeRequest<INotification[]>(
      url,
      ReqType.GET,
      'Error fetching unread notifications. Try again later.'
    );
  };
}

const notificationService = NotificationServiceImpl.getInstance(
  NOTIFICATIONS_API,
  USERS_API,
  apiService
);
export { notificationService, NotificationServiceImpl };

// /**
//  * Find all the notifications for a particular user.
//  * @param userId id of the user requesting the latest notifications
//  * @returns {Promise<{[Notification]}>} the array of notification objects or error
//  */
// export const findNotifications = async (userId: string) =>
//   callAPI<INotification[]>(
//     `${USERS_API}/${userId}/notifications`,
//     Requests.GET,
//     'Error fetching notifications. Try again later.'
//   );

// export const createNotification = async (
//   userId: string,
//   notification: INotification
// ) =>
//   callAPI<INotification, INotification>(
//     `${USERS_API}/${userId}/notifications`,
//     Requests.POST,
//     'Error creating notification. Try again later.',
//     notification
//   );

// /**
//  * Update a notificaton as read.
//  * @param nid id of the notification being read
//  * @returns {Promise<{Notification}>} the notification object or error
//  */
// export const markNotificationAsRead = async (nid: string) =>
//   callAPI<INotification>(
//     `${NOTIFICATIONS_API}/${nid}/read`,
//     Requests.PUT,
//     'Error marking notification as read. Try again later.'
//   );

// /**
//  * Get all of the unread notifications for a given user
//  * @param userId id of the user getting their unread notifications
//  * @returns {Promise<{[Notification]}>} the list of notification objects or error
//  */
// export const findUnreadNotifications = async (userId: string) =>
//   callAPI<INotification[]>(
//     `${USERS_API}/${userId}/notifications/unread`,
//     Requests.GET,
//     'Error fetching unread notifications. Try again later.'
//   );
