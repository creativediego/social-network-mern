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
    MESSAGES: {
      link: '/messages',
      content: `${notification.userNotified.username} messaged you.`,
    },
    LIKES: {
      link: `${notification.userNotified.username}/${notification.resourceId}/posts`,
      content: `${notification.userNotified.username} liked your post.`,
    },
    FOLLOWS: {
      link: `/${notification.userNotified.username}`,
      content: `${notification.userNotified.username} followed you.`,
    },
  };

  return (
    <>
      <Link
        to=''
        className='text-decoration-none'
        onClick={() => handleMarkAsRead(notification.id)}
      >
        <li
          className={`p-2 list-group-item d-flex rounded-0 align-items-center text-decoration-none ${
            !notification.read ? 'ttr-notification-unread' : ''
          }`}
          data-testid='ttr-notification-component'
          // ref={(el) => {
          //   if (el) {
          //     el.style.setProperty('background-color', boxColor, 'important');
          //   }
          // }}
        >
          <div className='pe-2'>
            {notification.userNotified && (
              <img
                src={
                  notification.userNotified.profilePhoto
                    ? notification.userNotified.profilePhoto
                    : `../images/${notification.userNotified.username}.jpg`
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
        </li>
      </Link>
    </>
  );
};
export default memo(Notification);
