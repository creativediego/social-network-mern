import React, { useState, useCallback } from 'react';
import { FormFieldI } from '../../../interfaces/FormFieldI';
import { selectActiveChatId } from '../../../redux/chatSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { selectAuthUser } from '../../../redux/userSlice';
import { sendMessageThunk } from '../../../redux/chatSlice';
import { IMessage } from '../../../interfaces/IMessage';
import { useAuthUser } from '../../../hooks/useAuthUser';

/**
 * Custom hook that manages the state of setting and sending a new chat message in the active chat.
 */
const useNewChatMessage = () => {
  const activeChatId = useAppSelector(selectActiveChatId);
  const dispatch = useAppDispatch();
  const [messageFieldAttributes, setMessageFieldAttributes] =
    useState<FormFieldI>({
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
      const content = messageFieldAttributes['chat'].value;
      dispatch(sendMessageThunk(content));
      setMessageFieldAttributes((prevState) => ({
        ...prevState,
        chat: {
          ...prevState['chat'],
          value: '',
        },
      }));
    },
    [messageFieldAttributes, activeChatId, dispatch]
  );
  return {
    messageFieldAttributes: messageFieldAttributes['chat'],
    setMessage,
    submitMessage,
  };
};

export default useNewChatMessage;
