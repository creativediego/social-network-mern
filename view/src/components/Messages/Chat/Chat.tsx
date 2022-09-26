import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  memo,
} from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import {
  findMessagesByConversationThunk,
  sendMessageThunk,
} from '../../../redux/messageThunks';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../forms';
// @ts-ignore
import Message from './Message';
import useChat from './useChat';
import { IMessage } from '../../../interfaces/IMessage';

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
      <Link
        to={`/messages`}
        className='mt-2 me-2 btn btn-large btn-primary border border-secondary fw-bolder rounded-pill'
      >
        <i className='fa-solid fa-circle-arrow-left text-white fs-6 px-1'></i>
        <span>Back to Inbox</span>
      </Link>
      <p className='mt-4 mb-4'>
        {participants.map((participant, index) => (
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
        {/* <form onSubmit={(e) => sendMessage(e)}>
            <FormInput
              label='Send'
              placeholder='Enter Message'
              className='mt-4 w-100 border-0 border border-light'
              value={newMessageBody.message}
              onChange={(e) =>
                setNewMessageBody({
                  ...newMessageBody,
                  message: e.target.value,
                })
              }
            />
            <button
              type='submit'
              className={`mt-3 btn btn-secondary rounded-pill fa-pull-right fw-bold ps-4 pe-4`}
            >
              Send
            </button>
          </form> */}
      </div>
    </>
  );
};

export default memo(Chat);
