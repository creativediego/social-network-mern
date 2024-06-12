import { Link } from 'react-router-dom';
import { INotification } from '../../../interfaces/INotification';

/**
 * Interface for the navigation link. It contains the label, path, icon, and color of the link.
 */
export interface INavLink {
  label: string;
  path: string;
  icon?: string;
  color?: string;
}

/**
 * `NavigationItemProps` is an interface for the properties of the `NavigationItem` component. It contains the link, pathname, notifications, and unread message count.
 */
interface NavigationItemProps {
  link: INavLink;
  pathname: string;
  notifications: INotification[];
  unreadMessageCount: number;
}

/**
 * `NavigationItem` is a component that renders a navigation item in the sidebar.
 * It uses the `getNotificationBadge` function to determine whether to display a notification badge.
 *
 * @param {NavigationItemProps} props - The properties passed to the component.
 * @param {INavLink} props.link - The link of the navigation item.
 * @param {string} props.pathname - The current pathname.
 * @param {INotification[]} props.notifications - The notifications for the user.
 * @param {number} props.unreadMessageCount - The count of unread messages.
 *
 * @returns {JSX.Element} The `NavigationItem` component, which includes a link to the specified path and a notification badge if there are any notifications.
 *
 * @example
 * <NavigationItem link={link} pathname={pathname} notifications={notifications} unreadMessageCount={unreadMessageCount} />
 *
 * @see {@link INavLink} for the interface of a navigation link.
 * @see {@link INotification} for the interface of a notification.
 */
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
