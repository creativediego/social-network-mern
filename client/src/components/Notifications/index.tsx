import React from 'react';
import Notification from './Notification';
import { INotification } from '../../interfaces/INotification';
import useNotifications from './useNotifications';

/**
 *  A container to display a list of notifications.
 */
const Notifications = () => {
  const { notifications, handleMarkAsRead } = useNotifications();
  return (
    <div>
      <ul className='ttr-posts list-group'>
        {notifications.length < 1 && <p>You have no notifications.</p>}
        {notifications &&
          notifications.map((notification: INotification) => {
            return (
              <Notification
                key={notification.id}
                notification={notification}
                handleMarkAsRead={handleMarkAsRead}
              />
            );
          })}
      </ul>
    </div>
  );
};

export default Notifications;
