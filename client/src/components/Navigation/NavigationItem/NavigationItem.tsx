import React from 'react';
import { Link } from 'react-router-dom';
import { INotification } from '../../../interfaces/INotification';

export interface INavLink {
  label: string;
  path: string;
  icon?: string;
  color?: string;
}

interface NavigationItemProps {
  link: INavLink;
  pathname: string;
  notifications: INotification[];
  unreadMessageCount: number;
}

const NavigationItem = ({
  link,
  pathname,
  notifications,
  unreadMessageCount,
}: NavigationItemProps): JSX.Element => {
  const getNotificationBadge = () => {
    if (link.label === 'Notifications' && notifications.length > 0) {
      return (
        <span
          className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
          style={{ fontSize: '.7rem' }}
        >
          {notifications.length}
        </span>
      );
    } else if (link.label === 'Messages' && unreadMessageCount > 0) {
      return (
        <span
          className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
          style={{ fontSize: '.7rem' }}
        >
          {unreadMessageCount}
        </span>
      );
    }
    return null;
  };

  return (
    <li
      className={`list-group-item border-0 ttr-font-size-150pc text-nowrap ${
        pathname.includes(link.path) ? 'fw-bold' : ''
      }`}
    >
      <Link
        title={link.label}
        to={link.path}
        id={link.label}
        className='text-decoration-none text-black'
      >
        <span className='position-relative'>
          <i
            className={`fa ${link.icon} text-center mx-2 position-relative`}
            style={{ color: link.color }}
          >
            {getNotificationBadge()}
          </i>
          <span className='ttr-label'>{link.label}</span>
        </span>
      </Link>
    </li>
  );
};

export default NavigationItem;
