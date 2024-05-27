import { memo } from 'react';
import { FormField } from '../../../../forms';
import useChatMessageForm from './useChatMessageForm';

/**
 * `ChatMessageForm` is a component that displays a form for sending chat messages.
 * It uses the `useChatMessageForm` custom hook to manage the form state and handle form submission.
 *
 * @returns {JSX.Element} The `ChatMessageForm` component, which includes a text field for the message and a submit button.
 * The message field is managed by the `messageFieldAttributes` and `setMessage` values from the `useChatMessageForm` hook.
 * The form submission is handled by the `submitMessage` function from the `useChatMessageForm` hook.
 *
 * @example
 * <ChatMessageForm />
 *
 * @see {@link useChatMessageForm} for the hook that provides the form state and actions.
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
