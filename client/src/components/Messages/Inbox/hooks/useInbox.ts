import { useCallback, useEffect } from 'react';
import { clearChat } from '../../../../redux/chatSlice';
import { useAppSelector, useAppDispatch } from '../../../../redux/hooks';
import {
  inboxLoadingSelector,
  selectAllInboxMessages,
} from '../../../../redux/inboxSlice';
import {
  findInboxMessagesThunk,
  deleteInboxChatThunk,
} from '../../../../redux/inboxSlice';
import { IMessage } from '../../../../interfaces/IMessage';

/**
 * `useInbox` is a custom hook that manages the state of the user's inbox messages.
 *
 * It uses the `useAppSelector` hook to get the messages and the loading state from the Redux store.
 * It uses the `useAppDispatch` hook to dispatch actions to the Redux store.
 * It uses the `useCallback` hook to memoize the `deleteConversation` function.
 * It uses the `useEffect` hook to clear the chat and find the inbox messages when the component mounts.
 *
 * @hook
 * @example
 * Example usage of useInbox hook
 * const { messages, loading, deleteConversation } = useInbox();
 *
 * @returns {{ messages: IMessage[], loading: boolean, deleteConversation: (conversationId: string) => Promise<void> }}
 * An object containing:
 * - `messages`: An array of IMessage objects representing the messages in the user's inbox.
 * - `loading`: A boolean indicating whether the messages are loading.
 * - `deleteConversation`: A function that takes a conversation ID as a parameter and returns a Promise that resolves when the action to delete the conversation is dispatched.
 */
const useInbox = (): {
  messages: IMessage[];
  loading: boolean;
  deleteConversation: (conversationId: string) => Promise<void>;
} => {
  const messages = useAppSelector(selectAllInboxMessages);
  const loading = useAppSelector(inboxLoadingSelector);
  const dispatch = useAppDispatch();

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      dispatch(deleteInboxChatThunk(conversationId));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(clearChat());
    dispatch(findInboxMessagesThunk());
  }, [dispatch]);
  return {
    messages,
    loading,
    deleteConversation,
  };
};

export default useInbox;
