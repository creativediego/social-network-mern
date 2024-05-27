import { useState, useCallback, FormEvent } from 'react';
import { FormFieldI } from '../../../../interfaces/FormFieldI';
import { useAppDispatch } from '../../../../redux/hooks';
import { sendMessage } from '../../../../redux/chatSlice';

/**
 * `useChatMessageForm` is a custom hook that provides state and actions for the chat message form.
 * It uses the `useAppDispatch` hook from Redux to dispatch actions, and `useState` and `useCallback` from React to manage local state.
 *
 * @returns {object} An object containing the following values:
 * - `messageFieldAttributes`: An object containing the attributes for the message field in the form.
 * - `setMessage`: A function to update the value of the message field.
 * - `submitMessage`: A function to handle form submission and dispatch the `sendMessage` action.
 *
 * @example
 * const { messageFieldAttributes, setMessage, submitMessage } = useChatMessageForm();
 *
 * @see {@link useAppDispatch} for the hook that provides access to the Redux store.
 * @see {@link sendMessage} for the action that sends a chat message.
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

  const setMessage = useCallback((e: FormEvent<HTMLInputElement>) => {
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
    (e: FormEvent<HTMLFormElement>): void => {
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
