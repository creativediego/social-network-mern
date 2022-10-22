import React, { useState, useCallback, memo } from 'react';
import { InputFieldI } from '../../../interfaces/InputFieldI';
import { selectActiveChatId } from '../../../redux/chatSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAuthUser } from '../../../redux/userSlice';
import { sendMessageThunk } from '../../../redux/chatSlice';

/**
 * Custom hook that manages the state of setting and sending a new chat message in the active chat.
 */
const useNewChatMessage = () => {
  const activeChatId = useAppSelector(selectActiveChatId);
  const sender = useAppSelector(selectAuthUser).id;
  const dispatch = useAppDispatch();
  const [messageFieldAttributes, setMessageFieldAttributes] =
    useState<InputFieldI>({
      chat: {
        id: '1',
        name: 'chat',
        type: 'text',
        placeholder: 'type message here',
        errorMessage: 'Message must be between 0 and 280 characters,',
        label: '',
        required: true,
        value: '',
        pattern: '^.{0,280}$',
      },
    });

  const setMessage = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const element: HTMLInputElement = e.currentTarget;
    setMessageFieldAttributes((prevState) => ({
      ...prevState,
      chat: {
        ...prevState['chat'],
        value: element.value,
      },
    }));
  }, []);

  const submitMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const message = {
        sender,
        conversationId: activeChatId,
        message: messageFieldAttributes['chat'].value,
      };
      dispatch(sendMessageThunk(message));
      setMessageFieldAttributes((prevState) => ({
        ...prevState,
        chat: {
          ...prevState['chat'],
          value: '',
        },
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messageFieldAttributes]
  );
  return {
    messageFieldAttributes: messageFieldAttributes['chat'],
    setMessage,
    submitMessage,
  };
};

export default useNewChatMessage;
