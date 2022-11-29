import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  findNotificationsThunk,
  markNotificationReadThunk,
  selectAllNotifications,
  selectNotificationsLoading,
} from '../../redux/notificationSlice';

const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectAllNotifications);
  const loading = useAppSelector(selectNotificationsLoading);

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      dispatch(markNotificationReadThunk(notificationId));
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
