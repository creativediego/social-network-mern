import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import {
  selectChatLoading,
  findMessagesByConversationThunk,
  selectAllParticipants,
} from '../../../redux/chatSlice';

import { selectAllChatMessages } from '../../../redux/chatSlice';

/**
 * Custom hook to returns messages in an active chat, the participants, and loading state.
 *
 */
const useChat = (conversationId: string) => {
  const dispatch = useAppDispatch();

  const messages = useAppSelector(selectAllChatMessages);
  const loading = useAppSelector(selectChatLoading);
  const participants = useAppSelector(selectAllParticipants);

  useEffect(() => {
    dispatch(findMessagesByConversationThunk(conversationId));
  }, [dispatch, conversationId]);

  return { messages, participants, loading };
};

export default useChat;
