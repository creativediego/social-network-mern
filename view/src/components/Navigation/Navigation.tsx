import React from 'react';
import './navigation.css';
import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import {
  findUnreadNotificationsThunk,
  selectUnreadNotifications,
} from '../../redux/notificationSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

/**
 * Displays the main navigation menu of the app.
 */
const Navigation = (): JSX.Element => {
  const { pathname } = useLocation();
  const authUser = useAppSelector((state: any) => state.user.data);
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectUnreadNotifications);

  let notificationColor;
  if (notifications.length > 0) {
    notificationColor = '#2a9fd6';
  } else {
    notificationColor = 'white';
  }

  useEffect(() => {
    dispatch(findUnreadNotificationsThunk());
  }, [dispatch]);

  const links = [
    // { label: 'Tuiter', icon: 'fa-square-t', path: '/tuiter', color: 'white' },
    { label: 'Home', icon: 'fa-home', path: '/home', color: 'white' },
    // { label: 'Explore', icon: 'fa-hashtag', path: '/explore', color: 'white' },
    {
      label: 'Notifications',
      icon: 'fa-bell',
      path: '/notifications',
      color: notificationColor,
      // color: '#2a9fd6',
    },
    {
      label: 'Messages',
      icon: 'fa-envelope',
      path: '/messages',
      color: 'white',
    },
    // {
    //   label: 'Bookmarks',
    //   icon: 'fa-bookmark',
    //   path: '/bookmarks',
    //   color: 'white',
    // },
    // { label: 'Lists', icon: 'fa-list', path: '/lists', color: 'white' },
    {
      label: 'Profile',
      icon: 'fa-user',
      path: `/${authUser.username}/tuits`,
      color: 'white',
    },
    {
      label: 'Search',
      icon: 'fa-magnifying-glass',
      path: '/search/?q=',
      color: 'white',
    },
    // {
    //   label: 'More',
    //   icon: 'fa-circle-ellipsis',
    //   path: '/more',
    //   color: 'white',
    // },
  ];

  return (
    <div className='ttr-navigation'>
      <ul className='list-group'>
        {links.map((link, ndx) => {
          return (
            <li
              key={ndx}
              className={`list-group-item border-0 ttr-font-size-150pc text-nowrap
         ${pathname.indexOf(link.path) >= 0 ? 'fw-bold' : ''}`}
            >
              <Link
                to={link.path}
                id={link.label}
                className='text-decoration-none text-black'
              >
                <span className='position-relative'>
                  <i
                    className={`fa ${link.icon} text-center mx-2 position-relative`}
                    style={{ color: link.color }}
                  >
                    {link.label === 'Notifications' &&
                    notifications.length > 0 ? (
                      <span
                        className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
                        style={{ fontSize: '.7rem' }}
                      >
                        {notifications.length}
                      </span>
                    ) : null}
                  </i>
                  <span className='ttr-label'>{link.label}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Navigation;
