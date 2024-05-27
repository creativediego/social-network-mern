import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../../../redux/hooks';
import {
  selectChatLoading,
  findMessagesByChat,
  selectAllParticipants,
  selectActiveChatId,
  clearChat,
} from '../../../../../redux/chatSlice';

import { selectAllChatMessages } from '../../../../../redux/chatSlice';
import { useParams } from 'react-router-dom';
import { findInboxMessages } from '../../../../../redux/inboxSlice';

/**
 * `useChat` is a custom hook that manages the state of an active chat, including messages, the participants, and loading state.
 * It uses the `useAppSelector`, `useAppDispatch`, and `useParams` hooks from Redux and React Router to interact with the global state and the URL parameters.
 *
 * @returns {object} An object containing the following values:
 * - `chatId`: The ID of the active chat, which is obtained from the URL parameters or the Redux state.
 * - `messages`: The messages of the active chat, which are obtained from the Redux state.
 * - `participants`: The participants of the active chat, which are obtained from the Redux state.
 * - `loading`: The loading state of the chat, which is obtained from the Redux state.
 *
 * @example
 * const { chatId, messages, participants, loading } = useChat();
 *
 * @see {@link useAppSelector} and {@link useAppDispatch} for the hooks that provide access to the Redux store.
 * @see {@link useParams} for the hook that provides access to the URL parameters.
 * @see {@link selectActiveChatId}, {@link selectAllChatMessages}, {@link selectAllParticipants}, and {@link selectChatLoading} for the selectors that provide the chat data.
 * @see {@link findMessagesByChat}, {@link findInboxMessages}, and {@link clearChat} for the actions that manage the chat data.
 */
const useChat = () => {
  // Get chat id from url path or redux state.
  let { urlChatId } = useParams();
  const reduxChatId = useAppSelector(selectActiveChatId);
  const chatId = urlChatId || reduxChatId;

  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectAllChatMessages);
  const loading = useAppSelector(selectChatLoading);
  const participants = useAppSelector(selectAllParticipants);

  useEffect(() => {
    if (chatId && chatId !== 'undefined') {
      dispatch(findMessagesByChat(chatId));
    }
    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, chatId]);

  return { activeChatId: chatId, messages, participants, loading };
};

export default useChat;
