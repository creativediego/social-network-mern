import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  getNotificationCountThunk,
  selectNotificationCount,
} from '../../redux/notificationSlice';
import {
  getUnreadChatIdsThunk,
  selectUnreadChatCount,
} from '../../redux/chatSlice';

export const useNavigationNotifications = () => {
  const dispatch = useAppDispatch();
  const unreadNotifications = useAppSelector(selectNotificationCount);
  const unreadChats = useAppSelector(selectUnreadChatCount);

  useEffect(() => {
    if (unreadNotifications === 0) {
      dispatch(getNotificationCountThunk());
    }
    if (unreadChats === 0) {
      dispatch(getUnreadChatIdsThunk());
    }
  }, []);

  return { unreadNotifications, unreadChats };
};
