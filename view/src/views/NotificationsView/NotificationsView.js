import React, { useEffect, useLayoutEffect } from 'react';
import Notifications from '../../components/Notifications/index.js';
import { useSelector, useDispatch } from 'react-redux';
import {
  findNotificationsThunk,
  findUnreadNotificationsThunk,
} from '../../redux/notificationSlice';
import { Routes, Route } from 'react-router-dom';
import ProfileView from '../ProfileView/index.js';
import Notification from '../../components/Notifications/notification.js';

/**
 * Creates a page that displays all of the notifications for a given user
 */
const NotificationsView = () => {
  const notifications = useSelector((state) => state.notifications.all);
  const dispatch = useDispatch();

  // let notificationRoute = {
  //   MESSAGES: '/messages',
  //   LIKES: `${notification.userActing.username}/${notification.resourceId}/tuits`,
  //   FOLLOWS: `/${notification.userActing.username}`,
  // };

  useEffect(() => {
    dispatch(findNotificationsThunk());
  }, []);

  useLayoutEffect(() => {}, []);
  return (
    <div>
      {/* <Routes>
        <Route
          path={'/me'}
          element={<ProfileView user={notification.userActing} />}
        /> */}
      <h1>Notifications</h1>
      <ul className='ttr-tuits list-group'>
        {notifications &&
          notifications.map((notification) => {
            return (
              <Notification key={notification.id} notification={notification} />
            );
          })}
      </ul>
    </div>
  );
};
export default NotificationsView;
