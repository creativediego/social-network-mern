import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { IMessage } from '../../../interfaces/IMessage';
import InboxOptions from './InboxOptions';

interface InboxMessageProps {
  message: IMessage;
}

/**
 * A component to render each latest message.
 */
const InboxMessage = ({ message }: InboxMessageProps) => {
  const { user: authUser } = useAuthUser();

  return (
    <li className='p-2 inbox-item list-group-item rounded-0 bg-info m-0 px-0 py-0'>
      <div
        className={`d-flex p-2 ${
          message.sender.id !== authUser.id &&
          !message.readBy.includes(authUser.id)
            ? 'bg-primary'
            : 'bg-secondary'
        }`}
      >
        <Link
          style={{ zIndex: '1', flex: '1' }}
          to={`/messages/${message.chatId}`}
          id={message.id}
          className='text-decoration-none text-white'
        >
          <div className={`w-100 d-flex`}>
            <div className='pe-2'>
              {message.recipients && message.recipients.length > 0 && (
                <img
                  src={
                    message.sender.profilePhoto
                      ? message.sender.profilePhoto
                      : `../images/${message.sender.username}.jpg`
                  }
                  className='ttr-post-avatar-logo rounded-circle'
                  alt='profile'
                />
              )}
              {message.recipients && message.recipients.length === 0 && (
                <img
                  src={authUser.profilePhoto}
                  className='ttr-post-avatar-logo rounded-circle'
                  alt='profile'
                />
              )}
            </div>
            <div className='w-100'>
              <p className='fs-6 fw-bold'>{message.sender.name}</p>
              {message.content}
            </div>
          </div>
        </Link>
        <InboxOptions message={message} />
      </div>
    </li>
  );
};

export default memo(InboxMessage);
