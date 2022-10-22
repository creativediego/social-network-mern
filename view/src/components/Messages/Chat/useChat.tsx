import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import {
  selectChatLoading,
  findMessagesByConversationThunk,
  selectAllParticipants,
  selectActiveChatId,
} from '../../../redux/chatSlice';

import { selectAllChatMessages } from '../../../redux/chatSlice';
import { useLocation } from 'react-router-dom';

/**
 * Manages the state of an active chat, including messages, the participants, and loading state.
 *
 */
const useChat = () => {
  // Get chat id from url path or redux state.
  const urlPath = useLocation().pathname.split('/');
  const urlChatId = urlPath[urlPath.length - 1];
  const reduxChatId = useAppSelector(selectActiveChatId);
  const activeChatId = urlChatId || reduxChatId;

  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectAllChatMessages);
  const loading = useAppSelector(selectChatLoading);
  const participants = useAppSelector(selectAllParticipants);

  useEffect(() => {
    dispatch(findMessagesByConversationThunk(activeChatId));
  }, [dispatch, activeChatId]);

  return { activeChatId, messages, participants, loading };
};

export default useChat;
