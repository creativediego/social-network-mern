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

/**
 * `useNavigationNotifications` is a custom hook that manages the unread notifications and chats for the navigation menu.
 * It uses the `useEffect`, `useAppDispatch`, and `useAppSelector` hooks from React and Redux to manage side effects, dispatch actions, and access the Redux store.
 * It dispatches the `getNotificationCountThunk` and `getUnreadChatIdsThunk` actions if the unread notifications and chats are 0.
 *
 * @returns {NavigationNotifications} An object containing the following values:
 * - `unreadNotifications`: The count of unread notifications.
 * - `unreadChats`: The count of unread chats.
 *
 * @example
 * const { unreadNotifications, unreadChats } = useNavigationNotifications();
 *
 * @see {@link useAppDispatch} for the hook that provides the Redux dispatch function.
 * @see {@link useAppSelector} for the hook that provides access to the Redux store.
 * @see {@link getNotificationCountThunk} and {@link getUnreadChatIdsThunk} for the actions that get the count of unread notifications and chats.
 * @see {@link selectNotificationCount} and {@link selectUnreadChatCount} for the selectors that provide the count of unread notifications and chats.
 */
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
