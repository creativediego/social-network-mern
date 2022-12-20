import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';

import {
  findInboxMessagesThunk,
  deleteConversationThunk,
} from '../../../redux/messageInboxSlice';

/**
 * Manages the state of a single inbox message.
 */
const useInboxMessage = () => {
  const dispatch = useAppDispatch();
  const [messageOptions, setMessageOptions] = useState(false);

  const toggleMessageOptions = useCallback(() => {
    setMessageOptions(!messageOptions);
  }, [messageOptions]);

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
    deleteConversation,
    messageOptions,
    toggleMessageOptions,
  };
};

export default useInboxMessage;
