import React, { memo } from 'react';
import { FormField } from '../../../../forms';
import useChatMessageForm from './useChatMessageForm';

/**
 * ChatMessageForm component.
 *
 * This component displays an input to write and send a new message in the active chat.
 * It uses the `useChatMessageForm` custom hook to manage the state.
 *
 * The `messageFieldAttributes` object represents the attributes of the message field.
 * The `setMessage` function sets the value of the message field.
 * The `submitMessage` function submits the new message.
 *
 * @returns {JSX.Element} The form with the message field and the submit button.
 */
const ChatMessageForm = () => {
  const { messageFieldAttributes, setMessage, submitMessage } =
    useChatMessageForm();
  return (
    <form onSubmit={(e) => submitMessage(e)}>
      <FormField
        {...messageFieldAttributes}
        cssClass='mt-4 w-100 border-0 border border-light'
        onChange={(e) => setMessage(e)}
      />
      <button
        type='submit'
        className={`mt-3 btn btn-secondary rounded-pill fa-pull-right fw-bold ps-4 pe-4`}
      >
        Send
      </button>
    </form>
  );
};

export default memo(ChatMessageForm);
