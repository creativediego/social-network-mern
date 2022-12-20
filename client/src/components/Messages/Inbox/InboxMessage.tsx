import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { IMessage } from '../../../interfaces/IMessage';
import useInboxMessage from './useInboxMessage';

interface InboxMessageProps {
  message: IMessage;
}

/**
 * A component to render each latest message.
 */
const InboxMessage = ({ message }: InboxMessageProps) => {
  const { deleteConversation, messageOptions, toggleMessageOptions } =
    useInboxMessage();
  const { user } = useAuthUser();

  return (
    <li className='p-2 inbox-item list-group-item d-flex rounded-0'>
      <Link
        style={{ zIndex: '1', flex: '1' }}
        to={`/messages/${message.conversationId}`}
        id={message.id}
        className='text-decoration-none text-white'
      >
        <div className='w-100 d-flex'>
          <div className='pe-2'>
            {message.recipients && message.recipients.length > 0 && (
              <img
                src={
                  message.recipients[0].profilePhoto
                    ? message.recipients[0].profilePhoto
                    : `../images/${message.recipients[0].username}.jpg`
                }
                className='ttr-post-avatar-logo rounded-circle'
                alt='profile'
              />
            )}
            {message.recipients && message.recipients.length === 0 && (
              <img
                src={user.profilePhoto}
                className='ttr-post-avatar-logo rounded-circle'
                alt='profile'
              />
            )}
          </div>
          <div className='w-100'>
            <p className='fs-6 fw-bold'>
              {message &&
                message.recipients.length === 1 &&
                message.recipients[0].name}
              {message &&
                message.recipients.length > 1 &&
                message.recipients[0].name +
                  ', ' +
                  message.recipients[1].name +
                  ' ...'}
            </p>
            {message && message.message}
          </div>
        </div>
      </Link>
      <span className='d-flex align-items-center'>
        {messageOptions && (
          <span
            className='px-2 btn text-danger'
            onClick={() => deleteConversation(message.conversationId)}
          >
            <i className='fa-solid fa-trash-can'></i> Delete for you
          </span>
        )}
        <span
          onClick={() => toggleMessageOptions()}
          style={{ zIndex: '2' }}
          className='fa-duotone p-0 fa-ellipsis fa-2x fa-pull-right btn text-dark fs-5'
        ></span>
      </span>
    </li>
  );
};

export default InboxMessage;
