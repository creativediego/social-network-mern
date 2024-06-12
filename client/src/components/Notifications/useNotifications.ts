import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  findNotificationsThunk,
  markNotificationReadThunk,
  selectAllNotifications,
  selectNotificationsLoading,
} from '../../redux/notificationSlice';

/**
 * `useNotifications` is a custom hook that manages the state of notifications.
 * It uses the `useCallback`, `useEffect`, `useAppDispatch`, and `useAppSelector` hooks from React and Redux to manage local state, dispatch actions, and access the Redux store.
 * It dispatches the `findNotificationsThunk` action to fetch the notifications, and provides a `handleMarkAsRead` function that dispatches the `markNotificationReadThunk` action to mark a notification as read.
 *
 * @returns {NotificationsState} An object containing the following values:
 * - `notifications`: The list of notifications.
 * - `loading`: A boolean indicating whether the notifications are being loaded.
 * - `handleMarkAsRead`: A function to mark a notification as read.
 *
 * @example
 * const { notifications, loading, handleMarkAsRead } = useNotifications();
 *
 * @see {@link useAppDispatch} for the hook that provides the Redux dispatch function.
 * @see {@link useAppSelector} for the hook that provides access to the Redux store.
 * @see {@link findNotificationsThunk} and {@link markNotificationReadThunk} for the actions that fetch the notifications and mark a notification as read.
 * @see {@link selectAllNotifications} and {@link selectNotificationsLoading} for the selectors that provide the notifications and the loading state.
 */
const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectAllNotifications);
  const loading = useAppSelector(selectNotificationsLoading);

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      await dispatch(markNotificationReadThunk(notificationId));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(findNotificationsThunk());
  }, [dispatch]);

  return {
    notifications,
    loading,
    handleMarkAsRead,
  };
};

export default useNotifications;
