import React, { memo } from 'react';
import './ChatView.scss';
import ChatMessage from '../ChatMessage/ChatMessage';
import useChat from './hooks/useChat';
import { IMessage } from '../../../../interfaces/IMessage';
import ChatMessageForm from '../ChatMessageForm/ChatMessageForm';
import { IUser } from '../../../../interfaces/IUser';
import Loader from '../../../Loader/Loader';
import useScrollToBottom from './hooks/useScrollToBottom';

/**
 * Displays the active chat window with all its messages and send message text area.
 *
 */
const ChatView = () => {
  const { loading, messages, participants } = useChat();
  const { windowRef } = useScrollToBottom(loading);

  return (
    <>
      <p className='mt-4 mb-4'>
        {participants.map((participant: IUser) => (
          <span
            className='badge rounded-pill bg-light mx-1'
            key={participant.id}
          >
            {participant.name}
          </span>
        ))}
      </p>
      <div id='chat-window'>
        <Loader loading={loading} />
        {messages.length > 0 &&
          messages.map((message: IMessage) => (
            <ChatMessage message={message} key={message.id} />
          ))}

        <div ref={windowRef} />
      </div>
      <div>
        <ChatMessageForm />
      </div>
    </>
  );
};

export default memo(ChatView);
