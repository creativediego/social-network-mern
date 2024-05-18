import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { INotification } from '../../interfaces/INotification';
import './Notification.scss';

/**
 * A component to render one notification.
 */

interface NotificationProps {
  notification: INotification;
  handleMarkAsRead: (notificationId: string) => void;
}

interface NotificationLink {
  [key: string]: { link: string; content: string };
}

const Notification = ({
  notification,
  handleMarkAsRead,
}: NotificationProps) => {
  // create a notification message depending on the type of notification
  let notificationLink: NotificationLink = {
    MESSAGE: {
      link: '/messages',
      content: `${notification.fromUser.username} messaged you.`,
    },
    LIKE: {
      link: `${notification.fromUser.username}/${notification.resourceId}/posts`,
      content: `${notification.fromUser.username} liked your post.`,
    },
    FOLLOW: {
      link: `/${notification.fromUser.username}`,
      content: `${notification.fromUser.username} followed you.`,
    },
  };

  return (
    <>
      <li
        className={`p-2 list-group-item d-flex rounded-0 align-items-center position-relative text-decoration-none ${
          !notification.read ? 'ttr-notification-unread' : ''
        }`}
        data-testid='ttr-notification-component'
      >
        <div className='pe-2'>
          {notification.toUser && (
            <img
              src={
                notification.toUser.profilePhoto
                  ? notification.toUser.profilePhoto
                  : `/images/default-avatar.png`
              }
              className='ttr-post-avatar-logo rounded-circle'
              alt='profile'
            />
          )}
        </div>
        <span className='ttr-text text-decoration-none'>
          {notification.read ? (
            <span className='ttr-text-normal'>
              {notificationLink[notification.type].content}
            </span>
          ) : (
            <strong className='ttr-text-strong'>
              {notificationLink[notification.type].content}
            </strong>
          )}
        </span>
        {/* Close button */}
        <button
          className='btn-close position-absolute top-0 end-0 m-2'
          aria-label='Close'
          onClick={() => handleMarkAsRead(notification.id)}
        ></button>
      </li>
    </>
  );
};
export default memo(Notification);
