import React from 'react';
import Notification from './Notification';
import { INotification } from '../../interfaces/INotification';

interface NotificationsProps {
  notifications: INotification[];
}

/**
 *  A container to display a list of notifications.
 */
const Notifications = ({ notifications }: NotificationsProps) => {
  return (
    <div>
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

export default Notifications;
