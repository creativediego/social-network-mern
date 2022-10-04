import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import './Message.scss';
import moment from 'moment';
import { IMessage } from '../../../interfaces/IMessage';
import { deleteMessageThunk } from '../../../redux/chatSlice';

interface MessageProps {
  message: IMessage;
}
/**
 * Displays a chat message in the current active/open chat with time sent and an option to remove/delete the message.
 */
const Message = ({ message }: MessageProps) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.data.id);
  const isLoggedInUser = message.sender && message.sender.id === userId;
  const [showOptions, setShowOptions] = useState(false);

  const bgColor = isLoggedInUser ? 'bg-primary' : 'bg-light';
  const position = isLoggedInUser ? 'flex-row-reverse' : 'justify-row';
  const displayAvatar = !isLoggedInUser;
  const bubbleBorder = isLoggedInUser
    ? 'logged-in-user-message'
    : 'other-user-message';

  const handleDeleteMessage = async () => {
    dispatch(deleteMessageThunk({ messageId: message.id, userId }));
  };

  return (
    <div className={`d-flex ${position} align-items-center mb-4`}>
      {displayAvatar && (
        <span style={{ width: '8%' }}>
          <img
            className='img-fluid rounded-circle'
            src={message.sender && message.sender.profilePhoto}
            alt='profile'
          />
        </span>
      )}

      <div className={`d-flex ${position} align-items-center`}>
        <span
          className={`btn rounded-pill text-white w-auto text-start ${bgColor} ${bubbleBorder}`}
          onClick={() => setShowOptions(!showOptions)}
        >
          {message.message}
        </span>
        {showOptions && (
          <span className='px-2 btn text-danger' onClick={handleDeleteMessage}>
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

export default Message;
