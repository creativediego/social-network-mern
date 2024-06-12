import Notification from './Notification';
import { INotification } from '../../interfaces/INotification';
import useNotifications from './useNotifications';

/**
 * `Notifications` is a component that renders a list of notifications.
 * It uses the `useNotifications` custom hook to get the notifications and the function to mark a notification as read.
 * It maps over the `notifications` array to render a `Notification` component for each notification.
 * If there are no notifications, it displays a message saying "You have no notifications."
 *
 * @returns {JSX.Element} The `Notifications` component, which includes a list of `Notification` components or a message if there are no notifications.
 *
 * @example
 * <Notifications />
 *
 * @see {@link useNotifications} for the custom hook that provides the notifications and the function to mark a notification as read.
 * @see {@link Notification} for the component that renders a notification.
 * @see {@link INotification} for the interface of a notification.
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
