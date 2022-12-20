import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  findUnreadNotificationsThunk,
  markNotificationReadThunk,
  selectAllNotifications,
  selectNotificationsLoading,
} from '../../redux/notificationSlice';

/**
 * Manages the state of notifications, including fetching the notifications and marking them as read.
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
    dispatch(findUnreadNotificationsThunk());
  }, [dispatch]);

  return {
    notifications,
    loading,
    handleMarkAsRead,
  };
};

export default useNotifications;
