import React, { memo } from 'react';
import InboxMessage from './InboxMessage';
import useInbox from './hooks/useInbox';
import { Loader } from '../../index';
import { IMessage } from '../../../interfaces/IMessage';

/**
 * `MessageInbox` is a component that displays a list of conversations in the user's inbox.
 *
 * It uses the `useInbox` hook to get the messages and the loading state.
 * It also uses the `Loader` component to display a loader while the messages are loading.
 *
 * @component
 * @example
 * Example usage of MessageInbox component
 * <MessageInbox />
 *
 * @returns {JSX.Element} A JSX element representing the message inbox.
 */
const Inbox = (): JSX.Element => {
  const { messages, loading } = useInbox();

  if (loading) {
    return <Loader loading={loading} size='fs-4' />;
  } else {
    return (
      <>
        <Loader loading={loading} size='fs-4' />
        {messages && messages.length < 1 && <div>You have no messages.</div>}
        <ul className='ttr-posts list-group'>
          {messages.length > 0
            ? messages.map((message: IMessage) => (
                <InboxMessage message={message} key={message.id} />
              ))
            : null}
        </ul>
      </>
    );
  }
};

export default memo(Inbox);
