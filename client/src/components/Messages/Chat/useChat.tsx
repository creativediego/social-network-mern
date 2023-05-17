import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import {
  selectChatLoading,
  findMessagesByConversationThunk,
  selectAllParticipants,
  selectActiveChatId,
  clearChat,
} from '../../../redux/chatSlice';

import { selectAllChatMessages } from '../../../redux/chatSlice';
import { useParams } from 'react-router-dom';
import { findInboxMessagesThunk } from '../../../redux/messageInboxSlice';

/**
 * Manages the state of an active chat, including messages, the participants, and loading state.
 * Custom hook that returns an object with the active chat id, messages, participants, and loading state. Also dispatches actions to fetch messages and participants. Will fetch messages on mount and when the chat id changes. Will fetch participants on mount. Will fetch inbox messages when messages are loaded. Will clear chat on unmount.
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
      dispatch(findMessagesByConversationThunk(chatId));
      dispatch(findInboxMessagesThunk());
    }
    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, chatId]);

  // When messages are loaded, will make a call to fetch the inbox again, which will updated unread message count in navigation.
  useEffect(() => {
    if (messages.length > 0) {
      dispatch(findInboxMessagesThunk());
    }
  }, [dispatch, messages]);

  return { activeChatId: chatId, messages, participants, loading };
};

export default useChat;
