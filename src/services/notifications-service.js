import axios from 'axios';
import { processError } from './helpers';

const NOTIFICATIONS_API = `${process.env.REACT_APP_API_URL}/notifications`;
const USERS_API = `${process.env.REACT_APP_API_URL}/users`;

export const api = axios.create({ withCredentials: true });

export const findAllNotifications = () =>
  api
    .get(NOTIFICATIONS_API)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findNotifationsForUser = (userId) =>
  api
    .get(`${USERS_API}/${userId}/notifications`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const createNotification = (userId, type, userId2, notificationString) =>
  api
    .post(`${USERS_API}/${userId}/notifications`, { userNotified: userId, type: type, userActing: userId2, notificationString: notificationString})
    .then((response) => response.data)
    .catch((err) => processError(err));

export const markNotificationAsRead = (nid) =>
    api.update(`${USERS_API}/${userId}/notifications/${nid}/read`, {_id: nid})
    .then((response) => response.data).catch((err) => processError(err));