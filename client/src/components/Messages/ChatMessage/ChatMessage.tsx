import React, { memo } from 'react';
import './ChatMessage.scss';
import moment from 'moment';
import { IMessage } from '../../../interfaces/IMessage';
import { useChatMessage } from './useChatMessage';
import { Link } from 'react-router-dom';

interface MessageProps {
  message: IMessage;
}
/**
 * Displays a chat message in the current active/open chat with time sent and an option to remove/delete the message. Uses custom hook useChatMessage to manage state.
 */
const ChatMessage = ({ message }: MessageProps) => {
  const { isLoggedInUser, showOptions, setShowOptions, deleteMessage } =
    useChatMessage(message);

  const bgColor = isLoggedInUser ? 'bg-primary' : 'bg-light';
  const position = isLoggedInUser ? 'flex-row-reverse' : 'justify-row';
  const displayAvatar = !isLoggedInUser;
  const bubbleBorder = isLoggedInUser
    ? 'logged-in-user-message'
    : 'other-user-message';

  return (
    <div
      aria-label='chat message'
      className={`d-flex ${position} align-items-center mb-4`}
    >
      {displayAvatar && (
        <span style={{ width: '8%' }}>
          <Link to={`/${message.sender && message.sender.username}/posts`}>
            <img
              className='img-fluid rounded-circle'
              src={message.sender && message.sender.profilePhoto}
              alt='profile'
            />
          </Link>
        </span>
      )}

      <div className={`d-flex ${position} align-items-center`}>
        <span
          className={`btn rounded-pill text-white w-auto text-start ${bgColor} ${bubbleBorder}`}
          onClick={() => setShowOptions(!showOptions)}
        >
          {message.content}
        </span>
        {showOptions && (
          <span className='px-2 btn text-danger' onClick={deleteMessage}>
            <i className='fa-solid fa-trash-can'></i> Delete for you
          </span>
        )}
      </div>

      <span className='px-2 badge text-dark'>
        {moment(message.createdAt).fromNow()}
      </span>
    </div>
  );
};

export default memo(ChatMessage);
