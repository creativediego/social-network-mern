import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getNotificationCountThunk,
  selectNotificationCount,
} from '../../redux/notificationSlice';

export const useNavigationNotifications = () => {
  const dispatch = useAppDispatch();
  const unreadNotifications = useAppSelector(selectNotificationCount);
  const unreadMessages = 0;

  useEffect(() => {
    dispatch(getNotificationCountThunk());
  }, []);

  return { unreadNotifications, unreadMessages };
};
