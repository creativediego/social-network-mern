/**
 * @file Middle tier for notifictions resource.
 * Provides a service to communicate with the restful API of the server.
 */

import axios from 'axios';
import { INotification } from '../interfaces/INotification';
import { Requests, callAPI, loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';

const NOTIFICATIONS_API = `${config.apiURL}/notifications`;
const USERS_API = `${config.apiURL}/users`;

const api = axios.create();
// api.defaults.headers.common['authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);
/**
 * Find all the notifications for a particular user.
 * @param userId id of the user requesting the latest notifications
 * @returns {Promise<{[Notification]}>} the array of notification objects or error
 */
export const findNotifications = async (userId: string) =>
  callAPI<INotification[]>(
    `${USERS_API}/${userId}/notifications`,
    Requests.GET
  );

export const createNotification = async (
  userId: string,
  notification: INotification
) =>
  callAPI<INotification>(
    `${USERS_API}/${userId}/notifications`,
    Requests.POST,
    notification
  );

/**
 * Update a notificaton as read.
 * @param nid id of the notification being read
 * @returns {Promise<{Notification}>} the notification object or error
 */
export const markNotificationAsRead = async (nid: string) =>
  callAPI<INotification>(`${NOTIFICATIONS_API}/${nid}/read`, Requests.PUT);

/**
 * Get all of the unread notifications for a given user
 * @param userId id of the user getting their unread notifications
 * @returns {Promise<{[Notification]}>} the list of notification objects or error
 */
export const findUnreadNotifications = async (userId: string) =>
  callAPI<INotification[]>(
    `${USERS_API}/${userId}/notifications/unread`,
    Requests.GET
  );
