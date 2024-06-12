import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthUser } from '../../../../hooks/useAuthUser';
import { IMessage } from '../../../../interfaces/IMessage';
import InboxOptions from '../InboxOptions/InboxOptions';

interface InboxMessageProps {
  message: IMessage;
}

/**
 * `InboxMessage` is a component that renders each latest message in the inbox.
 * It uses the `useMemo` and `useAuthUser` hooks to calculate the background class based on whether the message has been read by the authenticated user.
 *
 * @param {InboxMessageProps} props - The properties passed to the component.
 * @param {IMessage} props.message - The message to be rendered.
 *
 * @returns {JSX.Element} The `InboxMessage` component, which includes a list item with the message and a link to the chat.
 *
 * @example
 * <InboxMessage message={message} />
 *
 * @see {@link useAuthUser} for the hook that provides the authenticated user.
 * @see {@link useMemo} for the hook that calculates the background class.
 * @see {@link IMessage} for the interface of a message.
 * @see {@link InboxOptions} for the component that provides options for the inbox.
 */
const InboxMessage = ({ message }: InboxMessageProps) => {
  const { user: authUser } = useAuthUser();

  // Calculate background class based on message.readBy
  const backgroundClass = useMemo(() => {
    return message.readBy.includes(authUser.id) ? '' : 'bg-primary';
  }, [message.readBy, authUser.id]);

  return (
    <li className='p-2 inbox-item list-group-item rounded-0 bg-info m-0 px-0 py-0'>
      <div className={`d-flex p-2 rounded-0 inbox-item ${backgroundClass}`}>
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
