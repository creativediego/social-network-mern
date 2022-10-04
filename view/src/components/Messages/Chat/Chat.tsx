import React, { useRef, useLayoutEffect, memo } from 'react';
import Message from './Message';
import useChat from './useChat';
import { IMessage } from '../../../interfaces/IMessage';
import NewMessageForm from './NewMessageForm';
import { IUser } from '../../../interfaces/IUser';

/**
 * Displays the active chat window with all its messages and send message text area.
 *
 */
const Chat = ({ conversationId }: { conversationId: string }) => {
  const chatWindowRef = useRef<null | HTMLDivElement>(null);
  const { loading, messages, participants } = useChat(conversationId);

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
        {participants.map((participant: IUser, index) => (
          <span
            className='badge rounded-pill bg-light mx-1'
            key={participant.id}
          >
            {participant.name || participant.firstName}
          </span>
        ))}
      </p>
      <div id='chat-window'>
        {messages.length > 0 &&
          messages.map((message: IMessage) => (
            <Message message={message} key={message.id} />
          ))}

        <div ref={chatWindowRef} />
      </div>
      <div>
        <NewMessageForm />
      </div>
    </>
  );
};

export default memo(Chat);
