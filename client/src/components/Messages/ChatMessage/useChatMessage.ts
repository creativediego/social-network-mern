import { useCallback, useState } from 'react';
import { IMessage } from '../../../interfaces/IMessage';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { deleteMessageThunk } from '../../../redux/chatSlice';
import { selectAuthUser } from '../../../redux/userSlice';

/**
 * Manages the state of a single chat message, including whether the message is for the logged in user, the message options, and deleting/removing a message.
 */
export const useChatMessage = (message: IMessage) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUser).id;
  const isLoggedInUser = message.sender && message.sender.id === userId;
  const [showOptions, setShowOptions] = useState(false);

  const handleDeleteMessage = useCallback(() => {
    dispatch(deleteMessageThunk(message));
  }, [dispatch, message]);

  return {
    isLoggedInUser,
    showOptions,
    setShowOptions,
    deleteMessage: handleDeleteMessage,
  };
};
