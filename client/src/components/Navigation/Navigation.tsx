import { memo } from 'react';
import './navigation.css';
import { useLocation, Link } from 'react-router-dom';
import { useAuthUser } from '../../hooks/useAuthUser';
import { INavLink } from './NavigationItem/NavigationItem';
import { useNavigationNotifications } from './useNavigationNotifications';

/**
 * Displays the main navigation menu of the app.
 */
const Navigation = (): JSX.Element => {
  const { pathname } = useLocation();
  const { user: authUser } = useAuthUser();
  const { unreadNotifications, unreadChats } = useNavigationNotifications();

  let notificationColor;
  let messageColor;

  if (unreadNotifications > 0) {
    notificationColor = '#2a9fd6';
  } else {
    notificationColor = 'white';
  }
  if (unreadChats > 0) {
    messageColor = '#2a9fd6';
  } else {
    messageColor = 'white';
  }

  const links: INavLink[] = [
    { label: 'Home', icon: 'fa-home', path: '/', color: 'white' },
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
      color: messageColor,
    },

    {
      label: 'Profile',
      icon: 'fa-user',
      path: `/${authUser.username}/posts`,
      color: 'white',
    },
    {
      label: 'Search',
      icon: 'fa-magnifying-glass',
      path: '/search/?q=',
      color: 'white',
    },
  ];

  return (
    <div className='ttr-navigation'>
      <ul className='list-group nav-group'>
        {links.map((link, ndx) => {
          return (
            <li
              key={ndx}
              className={`list-group-item border-0 ttr-font-size-150pc text-nowrap
         ${pathname.indexOf(link.path) >= 0 ? 'fw-bold' : ''}`}
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
                    {link.label === 'Notifications' &&
                    unreadNotifications > 0 ? (
                      <span
                        className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
                        style={{ fontSize: '.7rem' }}
                      >
                        {unreadNotifications}
                      </span>
                    ) : null}

                    {link.label === 'Messages' && unreadChats > 0 ? (
                      <span
                        className='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger'
                        style={{ fontSize: '.7rem' }}
                      >
                        {unreadChats}
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

export default memo(Navigation);
