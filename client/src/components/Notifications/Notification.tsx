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
  console.log(notification.resourceId);

  // create a notification message depending on the type of notification
  let notificationLink: NotificationLink = {
    MESSAGES: {
      link: '/messages',
      content: `${notification.userActing.username} messaged you.`,
    },
    LIKES: {
      link: `${notification.userActing.username}/${notification.resourceId}/posts`,
      content: `${notification.userActing.username} liked your post.`,
    },
    FOLLOWS: {
      link: `/${notification.userActing.username}`,
      content: `${notification.userActing.username} followed you.`,
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
            {notification.userActing && (
              <img
                src={
                  notification.userActing.profilePhoto
                    ? notification.userActing.profilePhoto
                    : `../images/${notification.userActing.username}.jpg`
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
