import React, { memo } from 'react';
import InboxMessage from './InboxMessage';
import useInbox from './useInbox';
import { Loader } from '../../index';
import { IMessage } from '../../../interfaces/IMessage';

/**
 * A container component to display a list of conversations in the user's inbox.
 */
const InboxList = () => {
  const { messages, loading } = useInbox();
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
};

export default memo(InboxList);