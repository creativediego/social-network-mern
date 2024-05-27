import { useCallback, useState } from 'react';
import { IMessage } from '../../../../interfaces/IMessage';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { deleteMessage } from '../../../../redux/chatSlice';
import { selectAuthUser } from '../../../../redux/userSlice';

/**
 * `useChatMessage` is a custom hook that provides state and actions for a chat message.
 * It uses the `useAppDispatch` and `useAppSelector` hooks from Redux to interact with the global state.
 *
 * @param {IMessage} message - The message to manage with the `useChatMessage` hook.
 *
 * @returns {object} An object containing the following values:
 * - `isLoggedInUser`: A boolean indicating whether the message was sent by the logged-in user.
 * - `showOptions`: A boolean indicating whether to show options for the message (e.g., delete).
 * - `setShowOptions`: A function to set the `showOptions` state.
 * - `deleteMessage`: A function to delete the message.
 *
 * @example
 * const { isLoggedInUser, showOptions, setShowOptions, deleteMessage } = useChatMessage(message);
 *
 * @see {@link useAppDispatch} and {@link useAppSelector} for the hooks that provide access to the Redux store.
 * @see {@link deleteMessage} for the action that deletes a message from the chat.
 */
export const useChatMessage = (message: IMessage) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectAuthUser).id;
  const isLoggedInUser = message.sender && message.sender.id === userId;
  const [showOptions, setShowOptions] = useState(false);

  const handleDeleteMessage = useCallback(() => {
    dispatch(deleteMessage(message.id));
  }, [dispatch, message]);

  return {
    isLoggedInUser,
    showOptions,
    setShowOptions,
    deleteMessage: handleDeleteMessage,
  };
};
