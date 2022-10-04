import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { selectActiveChatId } from '../../redux/chatSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import {
  inboxLoadingSelector,
  selectAllInboxMessages,
} from '../../redux/messageInboxSlice';
import { findInboxMessagesThunk } from '../../redux/messageThunks';

const useInbox = () => {
  const inbox = useAppSelector(selectAllInboxMessages);
  const loading = useAppSelector(inboxLoadingSelector);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(findInboxMessagesThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { inbox, loading };
};

export default useInbox;
