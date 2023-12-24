import React, { useRef, useLayoutEffect, memo } from 'react';
import './Chat.scss';
import ChatMessage from '../ChatMessage/ChatMessage';
import useChat from './useChat';
import { IMessage } from '../../../interfaces/IMessage';
import NewChatMessage from '../ChatMessage/NewChatMessage';
import { IUser } from '../../../interfaces/IUser';
import Loader from '../../Loader/Loader';

/**
 * Displays the active chat window with all its messages and send message text area.
 *
 */
const Chat = () => {
  const chatWindowRef = useRef<null | HTMLDivElement>(null);
  const { loading, messages, participants } = useChat();

  const scrollToBottom = () => {
    if (chatWindowRef.current)
      chatWindowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
  };
  useLayoutEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  });
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

        <div ref={chatWindowRef} />
      </div>
      <div>
        <NewChatMessage />
      </div>
    </>
  );
};

export default memo(Chat);
