import React, { useEffect, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { findNotificationsThunk } from '../../redux/notificationSlice';
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
