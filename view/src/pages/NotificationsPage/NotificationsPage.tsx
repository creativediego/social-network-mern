import React from 'react';
import useNotifications from '../../components/Notifications/useNotifications';
import { Notification } from '../../components';
import { INotification } from '../../interfaces/INotification';

/**
 * Creates a page that displays all of the notifications for a given user
 */
const NotificationsPage = () => {
  const { notifications } = useNotifications();

  return (
    <div>
      <h1>Notifications</h1>
      <ul className='ttr-tuits list-group'>
        {notifications &&
          notifications.map((notification: INotification) => {
            return (
              <Notification key={notification.id} notification={notification} />
            );
          })}
      </ul>
    </div>
  );
};
export default NotificationsPage;
