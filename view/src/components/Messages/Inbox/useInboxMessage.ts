import { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';

import {
  findInboxMessagesThunk,
  deleteConversationThunk,
} from '../../../redux/messageInboxSlice';

const useInboxMessage = () => {
  const dispatch = useAppDispatch();
  const [messageOptions, setMessageOptions] = useState(false);

  const toggleMessageOptions = useCallback(() => {
    setMessageOptions(!messageOptions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
