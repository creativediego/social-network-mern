import React from 'react';
import { FormInput } from '../../../forms';
import useNewMessage from './useNewMessage';

/**
 * Displays input to write and send a new message in active chat. Uses custom hook to manage state.
 */
const NewMessageForm = () => {
  const { messageFieldAttributes, setMessage, submitMessage } = useNewMessage();
  return (
    <form onSubmit={(e) => submitMessage(e)}>
      <FormInput
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

export default NewMessageForm;
