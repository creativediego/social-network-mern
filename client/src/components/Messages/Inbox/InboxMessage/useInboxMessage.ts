import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../../redux/hooks';

import {
  findInboxMessages,
  deleteInboxChat,
} from '../../../../redux/inboxSlice';

/**
 * `useInboxMessage` is a custom hook that manages the state and actions for an inbox message.
 * It uses the `useCallback`, `useEffect`, `useState`, and `useAppDispatch` hooks from React and Redux to manage local state, dispatch actions, and perform side effects.
 *
 * @returns {InboxMessageActions} An object containing the following values:
 * - `messageOptions`: A boolean indicating whether the message options are visible.
 * - `toggleMessageOptions`: A function to toggle the visibility of the message options.
 * - `deleteConversation`: A function to delete the conversation of the inbox message.
 *
 * @example
 * const { messageOptions, toggleMessageOptions, deleteConversation } = useInboxMessage();
 *
 * @see {@link useAppDispatch} for the hook that provides the Redux dispatch function.
 * @see {@link findInboxMessages} and {@link deleteInboxChat} for the actions that find the inbox messages and delete a conversation.
 */

const useInboxMessage = () => {
  const dispatch = useAppDispatch();
  const [messageOptions, setMessageOptions] = useState(false);

  const toggleMessageOptions = useCallback(() => {
    setMessageOptions(!messageOptions);
  }, [messageOptions]);

  const deleteConversation = useCallback(
    (conversationId: string) => {
      return dispatch(deleteInboxChat(conversationId));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(findInboxMessages());
  }, [dispatch]);
  return {
    deleteConversation,
    messageOptions,
    toggleMessageOptions,
  };
};

export default useInboxMessage;
