/**
 * @file Middle tier for notifictions resource.
 * Provides a service to communicate with the restful API of the server.
 */

import axios from 'axios';
import { INotification } from '../interfaces/INotification';
import { Requests, callAPI } from '../util/apiConfig';
import { config } from '../config/appConfig';

const NOTIFICATIONS_API = `${config.apiURL}/notifications`;
const USERS_API = `${config.apiURL}/users`;

/**
 * Find all the notifications for a particular user.
 * @param userId id of the user requesting the latest notifications
 * @returns {Promise<{[Notification]}>} the array of notification objects or error
 */
export const findNotifications = async (userId: string) =>
  callAPI<INotification[]>(
    `${USERS_API}/${userId}/notifications`,
    Requests.GET,
    'Error fetching notifications. Try again later.'
  );

export const createNotification = async (
  userId: string,
  notification: INotification
) =>
  callAPI<INotification, INotification>(
    `${USERS_API}/${userId}/notifications`,
    Requests.POST,
    'Error creating notification. Try again later.',
    notification
  );

/**
 * Update a notificaton as read.
 * @param nid id of the notification being read
 * @returns {Promise<{Notification}>} the notification object or error
 */
export const markNotificationAsRead = async (nid: string) =>
  callAPI<INotification>(
    `${NOTIFICATIONS_API}/${nid}/read`,
    Requests.PUT,
    'Error marking notification as read. Try again later.'
  );

/**
 * Get all of the unread notifications for a given user
 * @param userId id of the user getting their unread notifications
 * @returns {Promise<{[Notification]}>} the list of notification objects or error
 */
export const findUnreadNotifications = async (userId: string) =>
  callAPI<INotification[]>(
    `${USERS_API}/${userId}/notifications/unread`,
    Requests.GET,
    'Error fetching unread notifications. Try again later.'
  );
