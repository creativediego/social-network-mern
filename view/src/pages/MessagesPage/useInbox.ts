import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { selectActiveChat } from '../../redux/chatSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  inboxLoadingSelector,
  selectAllInboxMessages,
} from '../../redux/messageInboxSlice';
import { findInboxMessagesThunk } from '../../redux/messageThunks';

const useInbox = () => {
  const inbox = useAppSelector(selectAllInboxMessages);
  const chatIdFromURL = useLocation().pathname.split('/').pop();
  const chatIdFromState = useAppSelector(selectActiveChat);
  const activeChatId = chatIdFromURL || chatIdFromState;
  const loading = useAppSelector(inboxLoadingSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(findInboxMessagesThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { inbox, loading, activeChatId };
};

export default useInbox;
