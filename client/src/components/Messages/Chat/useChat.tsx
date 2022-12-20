import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import {
  selectChatLoading,
  findMessagesByConversationThunk,
  selectAllParticipants,
  clearChat,
} from '../../../redux/chatSlice';

import { selectAllChatMessages } from '../../../redux/chatSlice';
import { useParams } from 'react-router-dom';

/**
 * Manages the state of an active chat, including messages, the participants, and loading state.
 *
 */
const useChat = () => {
  // Get chat id from url path or redux state.
  let { urlChatId } = useParams();
  const chatId = urlChatId || '';

  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectAllChatMessages);
  const loading = useAppSelector(selectChatLoading);
  const participants = useAppSelector(selectAllParticipants);

  useEffect(() => {
    if (chatId && chatId !== 'undefined') {
      dispatch(findMessagesByConversationThunk(chatId));
    }
    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, chatId]);

  return { activeChatId: chatId, messages, participants, loading };
};

export default useChat;
