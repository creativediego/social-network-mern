import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../../../interfaces/IUser';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { IConversation } from '../../../interfaces/IConversation';
import { selectAuthUser } from '../../../redux/userSlice';
import {
  createConversationThunk,
  selectActiveChatId,
} from '../../../redux/chatSlice';

/**
 * Manages the state of creating a new chat. Used with NewChat component.
 */
export const useNewChat = () => {
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

  const createNewChat = () => {
    if (selectedUsers.length < 1) {
      return;
    }
    setLoading(true);
    const conversation: IConversation = {
      id: '',
      participants: [...selectedUsers, authUser],
      createdBy: authUser,
    };
    dispatch(createConversationThunk(conversation));
    if (!isMounted.current) {
      return;
    }
    setLoading(false);
    setSelectedUsers([]);
  };

  useEffect(() => {
    setLoading(false);
    navigate(`/messages/${activeChatId}`);
    return () => {
      isMounted.current = false;
    };
  }, [activeChatId, navigate]);

  return {
    newChatLoading: loading,
    selectedUsers,
    selectUsersForChat,
    removeSelectedUser,
    createNewChat,
  };
};
