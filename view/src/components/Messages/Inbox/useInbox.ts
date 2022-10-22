import { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import {
  inboxLoadingSelector,
  selectAllInboxMessages,
} from '../../../redux/messageInboxSlice';
import {
  findInboxMessagesThunk,
  deleteConversationThunk,
} from '../../../redux/messageInboxSlice';

const useInbox = () => {
  const messages = useAppSelector(selectAllInboxMessages);
  const loading = useAppSelector(inboxLoadingSelector);
  const dispatch = useAppDispatch();

  const deleteConversation = useCallback(
    (conversationId: string) => {
      return dispatch(deleteConversationThunk(conversationId));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(findInboxMessagesThunk());
  }, [dispatch]);
  return {
    messages,
    loading,
    deleteConversation,
  };
};

export default useInbox;
