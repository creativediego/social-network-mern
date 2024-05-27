import React, { memo } from 'react';
import './ChatView.scss';
import ChatMessage from '../ChatMessage/ChatMessage';
import useChat from './hooks/useChat';
import { IMessage } from '../../../../interfaces/IMessage';
import ChatMessageForm from '../ChatMessageForm/ChatMessageForm';
import { IUser } from '../../../../interfaces/IUser';
import Loader from '../../../Loader/Loader';
import useScrollToBottom from './hooks/useScrollToBottom';
import { Link } from 'react-router-dom';
import { AvatarImage } from '../../..';
import { useAuthUser } from '../../../../hooks/useAuthUser';

/**
 * Displays the active chat window with all its messages and send message text area.
 *
 */
const ChatView = () => {
  const { loading, messages, participants } = useChat();
  const { windowRef } = useScrollToBottom(loading);
  const { user } = useAuthUser();

  return (
    <>
      <div id='chat-frame' className='d-flex flex-column'>
        <div className='mt-4 mb-4 d-flex justify-content-center'>
          {participants.map((participant: IUser) => {
            if (participant.id !== user.id) {
              return (
                <Link
                  to={`/${participant.username}/posts`}
                  key={participant.id}
                >
                  <div className='d-flex flex-column justify-content-center align-items-center'>
                    <div>
                      <AvatarImage
                        profilePhoto={participant.profilePhoto}
                        size={50}
                      />
                    </div>
                    <div className='d-flex  flex-column'>
                      <div
                        className='badge rounded-pill bg-light m-1'
                        key={participant.id}
                      >
                        {participant.name}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
        <div id='chat-window'>
          <Loader loading={loading} />
          {messages.length > 0 &&
            messages.map((message: IMessage) => (
              <ChatMessage message={message} key={message.id} />
            ))}
          <div ref={windowRef}> </div>
        </div>
        <div className='align-self-end chat-input'>
          <ChatMessageForm />
        </div>
      </div>
    </>
  );
};

export default memo(ChatView);
