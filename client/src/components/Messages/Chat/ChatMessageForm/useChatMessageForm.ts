import React, { useState, useCallback } from 'react';
import { FormFieldI } from '../../../../interfaces/FormFieldI';
import { useAppDispatch } from '../../../../redux/hooks';
import { sendMessage } from '../../../../redux/chatSlice';

/**
 * useChatMessageForm hook.
 *
 * This custom hook manages the state of setting and sending a new chat message in the active chat.
 * It uses the `useAppDispatch` hook from Redux and the `useState` and `useCallback` hooks from React.
 *
 * The `messageFieldAttributes` state is an object that represents the attributes of the message field.
 * The `setMessage` function is a callback that sets the value of the message field.
 *
 * @returns {{ messageFieldAttributes: FormFieldI, setMessage: (e: React.FormEvent<HTMLInputElement>) => void }} An object with the `messageFieldAttributes` state and the `setMessage` function.
 */
const useChatMessageForm = () => {
  const dispatch = useAppDispatch();
  const [messageFieldAttributes, setMessageFieldAttributes] =
    useState<FormFieldI>({
      message: {
        id: 'chat-message-form-field',
        name: 'message',
        type: 'text',
        placeholder: 'type message here',
        errorMessage:
          'Message must be between 0 and 280 alpha numeric characters,',
        label: '',
        required: true,
        value: '',
        pattern: '^[ws.,!?@#$%^&*()-+=<>;:\'"/\\\\]+$',
      },
    });

  const setMessage = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const element: HTMLInputElement = e.currentTarget;
    setMessageFieldAttributes((prevState) => ({
      ...prevState,
      message: {
        ...prevState['message'],
        value: element.value,
      },
    }));
  }, []);

  const submitMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
      const content = messageFieldAttributes['message'].value;
      if (!content) return;
      dispatch(sendMessage(content));
      setMessageFieldAttributes((prevState) => ({
        ...prevState,
        chat: {
          ...prevState['message'],
          value: '',
        },
      }));
    },
    [messageFieldAttributes, dispatch]
  );
  return {
    messageFieldAttributes: messageFieldAttributes['message'],
    setMessage,
    submitMessage,
  };
};

export default useChatMessageForm;
