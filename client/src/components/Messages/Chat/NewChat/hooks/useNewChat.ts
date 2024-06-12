import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../../../../interfaces/IUser';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { IChat } from '../../../../../interfaces/IChat';
import { selectAuthUser } from '../../../../../redux/userSlice';
import {
  createChatThunk,
  selectActiveChatId,
} from '../../../../../redux/chatSlice';

export interface NewChatActions {
  newChatLoading: boolean;
  selectedUsers: IUser[];
  selectUsersForChat: (user: IUser) => void;
  removeSelectedUser: (userId: string) => void;
  createNewChat: () => void;
  activeChatId: string;
}

/**
 * `useNewChat` is a custom hook that manages the state and actions for creating a new chat.
 * It uses the `useRef`, `useState`, `useCallback`, `useNavigate`, and `useAppSelector` hooks from React, React Router, and Redux to manage local state, navigate to different routes, and interact with the global state.
 *
 * @returns {NewChatActions} An object containing the following values:
 * - `newChatLoading`: A boolean indicating whether a new chat is being created.
 * - `selectedUsers`: An array of users selected to be in the new chat.
 * - `selectUsersForChat`: A function to select a user to be in the new chat.
 * - `removeSelectedUser`: A function to remove a selected user from the new chat.
 * - `createNewChat`: A function to create the new chat and navigate to it.
 * - `activeChatId`: The ID of the active chat.
 *
 * @example
 * const { newChatLoading, selectedUsers, selectUsersForChat, removeSelectedUser, createNewChat, activeChatId } = useNewChat();
 *
 * @see {@link useNavigate} for the hook that provides navigation functionality.
 * @see {@link useAppSelector} for the hook that provides access to the Redux store.
 * @see {@link selectAuthUser} and {@link selectActiveChatId} for the selectors that provide the authenticated user and the active chat ID.
 * @see {@link createChatThunk} for the action that creates a new chat.
 */
export const useNewChat = (): NewChatActions => {
  const isMounted = useRef(true);
  const navigate = useNavigate();
  const authUser = useAppSelector(selectAuthUser);
  const activeChatId = useAppSelector(selectActiveChatId);
  const [selectedUsers, setSelectedUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const selectUsersForChat = useCallback(
    (user: IUser) => {
      if (!selectedUsers.includes(user)) {
        setSelectedUsers([...selectedUsers, user]);
      }
    },
    [selectedUsers]
  );

  const removeSelectedUser = useCallback(
    (userId: string) => {
      setSelectedUsers(selectedUsers.filter((user) => user.id !== userId));
    },
    [selectedUsers]
  );

  const createNewChat = useCallback(async () => {
    if (selectedUsers.length < 1) {
      return;
    }
    setLoading(true);
    setSelectedUsers([]);

    const conversation: IChat = {
      id: '',
      participants: [...selectedUsers, authUser],
      creatorId: authUser.id,
      deletedBy: [],
      readBy: [],
    };

    dispatch(createChatThunk(conversation));
    if (isMounted.current) {
      setLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
  }, [authUser, dispatch, selectedUsers]);

  useEffect(() => {
    if (isMounted.current && activeChatId) {
      navigate(`/messages/${activeChatId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeChatId]);

  return {
    newChatLoading: loading,
    selectedUsers,
    selectUsersForChat,
    removeSelectedUser,
    createNewChat,
    activeChatId,
  };
};
