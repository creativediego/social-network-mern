import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { markNotificationReadThunk } from '../../redux/notificationSlice';

/**
 * @File A component to render one notification.
 */
const Notification = ({ notification }) => {
  const dispatch = useDispatch();

  // create a notification message depending on the type of notification
  let notificationLink = {
    MESSAGES: {
      link: '/messages',
      content: `${notification.userActing.username} messaged you.`,
    },
    LIKES: {
      link: `${notification.userActing.username}/${notification.resourceId}/tuits`,
      content: `${notification.userActing.username} liked your tuit.`,
    },
    FOLLOWS: {
      link: `/${notification.userActing.username}`,
      content: `${notification.userActing.username} followed you.`,
    },
  };

  let boxColor;
  if (notification.read) {
    boxColor = 'black';
  } else {
    boxColor = '#0f2d3c';
  }

  const handleMarkAsRead = async (notificationId) => {
    dispatch(markNotificationReadThunk(notificationId));
  };

  return (
    <div>
      <Link
        to={notificationLink[notification.type].link}
        className='text-decoration-none'
      >
        <li
          className={
            'p-2 list-group-item d-flex rounded-0 align-items-center text-decoration-none'
          }
          data-testid='ttr-notification-component'
          onClick={() => handleMarkAsRead(notification.id)}
          ref={(el) => {
            if (el) {
              el.style.setProperty('background-color', boxColor, 'important');
            }
          }}
        >
          <div className='pe-2'>
            {notification.userActing && (
              <img
                src={
                  notification.userActing.profilePhoto
                    ? notification.userActing.profilePhoto
                    : `../images/${notification.userActing.username}.jpg`
                }
                className='ttr-tuit-avatar-logo rounded-circle'
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
    </div>
  );
};
export default Notification;
