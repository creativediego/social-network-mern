import { memo, useMemo } from 'react';
import './ChatMessage.scss';
import moment from 'moment';
import { IMessage } from '../../../../interfaces/IMessage';
import { Link } from 'react-router-dom';
import { useAuthUser } from '../../../../hooks/useAuthUser';
import ChatMessageOptions from '../ChatMessageOptions.ts/ChatMessageOptions';

/**
 * MessageProps interface.
 *
 * This interface represents the props for the `ChatMessage` component.
 *
 * @interface
 * @property {IMessage} message - The message to display in the `ChatMessage` component.
 */
interface MessageProps {
  message: IMessage;
}
/**
 * `ChatMessage` is a component that displays a single chat message.
 * It uses the `useAuthUser` custom hook to determine if the message was sent by the logged-in user.
 *
 * @param {object} props - The properties passed to the component.
 * @param {IMessage} props.message - The message to display in the `ChatMessage` component.
 *
 * @returns {JSX.Element} The `ChatMessage` component, which includes the message text and sender's avatar.
 * The appearance of the message depends on whether it was sent by the logged-in user or another user.
 * Messages from the logged-in user are displayed on the right with a primary background color,
 * while messages from other users are displayed on the left with a light background color.
 *
 * @example
 * <ChatMessage message={message} />
 *
 * @see {@link useAuthUser} for the hook that provides the authenticated user.
 */

const ChatMessage = ({ message }: MessageProps) => {
  const { user } = useAuthUser();
  const isLoggedInUser = useMemo(
    () => user.id === message.sender.id,
    [message.sender.id, user.id]
  );

  const bgColor = isLoggedInUser ? 'bg-primary' : 'bg-light';
  const position = isLoggedInUser
    ? 'justify-content-end'
    : 'justify-content-start';
  const displayAvatar = !isLoggedInUser;
  const bubbleBorder = isLoggedInUser
    ? 'logged-in-user-message'
    : 'other-user-message';

  const optionsPosition = {
    justifyContent: isLoggedInUser ? 'flex-end' : 'flex-start',
    width: '100%', // Adjust width as needed
  };

  return (
    <div className={`chat-message-wrapper mb-4 d-flex ${position}`}>
      {displayAvatar && (
        <span style={{ width: '40px' }}>
          <Link to={`/${message.sender && message.sender.username}/posts`}>
            <img
              className='img-fluid rounded-circle'
              src={message.sender && message.sender.profilePhoto}
              alt='profile'
            />
          </Link>
        </span>
      )}

      <div
        className={`d-flex flex-column align-items-${
          isLoggedInUser ? 'end' : 'start'
        }`}
      >
        <span
          className={`btn rounded-pill text-white w-auto text-start ${bgColor} ${bubbleBorder}`}
        >
          {message.content}
        </span>
        <span className='px-2 badge text-dark'>
          {moment(message.createdAt).fromNow()}
        </span>

        {/* ChatMessageOptions positioned at the right boundary of the bubble */}
        <div style={optionsPosition}>
          <ChatMessageOptions message={message} />
        </div>
      </div>
    </div>
  );
};

export default memo(ChatMessage);
