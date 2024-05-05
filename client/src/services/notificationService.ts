/**
 * @file Middle tier for notifictions resource.
 * Provides a service to communicate with the restful API of the server.
 */

import axios from 'axios';
import { INotification } from '../interfaces/INotification';
import { urlConfig } from '../config/appConfig';
import { APIServiceI, ReqType, apiService } from './APIService';

const NOTIFICATIONS_API = `${urlConfig.apiURL}/notifications`;

interface INotificationService {
  findNotifications: () => Promise<INotification[]>;
  getNotificationCount: () => Promise<number>;
  markNotificationAsRead: (nid: string) => Promise<INotification>;
}

class NotificationServiceImpl implements INotificationService {
  private notificationsAPI: string;
  private APIService: APIServiceI;

  private constructor(notificationsAPI: string, apiService: APIServiceI) {
    this.notificationsAPI = notificationsAPI;
    this.APIService = apiService;
    Object.freeze(this);
  }

  public static getInstance(
    notificationsAPI: string,
    APIService: APIServiceI
  ): NotificationServiceImpl {
    return new NotificationServiceImpl(notificationsAPI, APIService);
  }

  public findNotifications = async () => {
    return await this.APIService.makeRequest<INotification[]>(
      this.notificationsAPI,
      ReqType.GET,
      'Error getting notifications. Try again later.'
    );
  };

  public markNotificationAsRead = async (nid: string) => {
    const url = `${this.notificationsAPI}/${nid}`;
    return await this.APIService.makeRequest<INotification>(
      url,
      ReqType.PUT,
      'Error marking notification as read. Try again later.'
    );
  };

  public getNotificationCount = async () => {
    return await this.APIService.makeRequest<number>(
      `${this.notificationsAPI}/count`,
      ReqType.GET,
      'Error getting the number of unread notifications. Try again later.'
    );
  };
}

const notificationService = NotificationServiceImpl.getInstance(
  NOTIFICATIONS_API,
  apiService
);
export { notificationService, NotificationServiceImpl };
