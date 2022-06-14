import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  findMessagesByConversationThunk,
  sendMessageThunk,
} from '../../redux/messageThunks';
import { Link } from 'react-router-dom';
import { FormInput } from '../../forms';
import Message from './Message';

/**
 * Displays the active chat window with all its messages and send message text area.
 * @param {string} conversationId the id of the conversation
 *
 */
const Chat = ({ conversationId }) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.data.id);
  const loading = useSelector((state) => state.messages.loading);
  let messages = useSelector((state) => state.messages.activeChat.messages);
  const [newMessageBody, setNewMessageBody] = useState({
    sender: userId,
    conversationId,
    message: '',
  });
  const chatWindowRef = useRef(null);

  useEffect(() => {
    dispatch(findMessagesByConversationThunk(conversationId));
  }, [dispatch, conversationId]);

  useLayoutEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  });

  const sendMessage = (e) => {
    e.preventDefault();
    setNewMessageBody({ ...newMessageBody, message: '' });
    dispatch(sendMessageThunk(newMessageBody));
  };

  const scrollToBottom = () => {
    chatWindowRef.current.scrollIntoView({
      // behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  };

  return (
    <div>
      <div>
        <Link
          to={`/messages`}
          className='mt-2 me-2 btn btn-large btn-primary border border-secondary fw-bolder rounded-pill'
        >
          <i className='fa-solid fa-circle-arrow-left text-white fs-6 px-1'></i>
          <span>Back to Inbox</span>
        </Link>
        {/* <p className='mt-4 mb-4'>
    {participants.map((participant, index) => (
      <span className='badge rounded-pill bg-light' key={participant.id}>
        {participant.name || participant.firstName}
      </span>
    ))}
  </p> */}
        <div id='chat-window'>
          {messages.length > 0 &&
            messages.map((message, index) => (
              <Message message={message} key={message.id} />
            ))}

          <div ref={chatWindowRef} />
        </div>
        <div>
          <form onSubmit={(e) => sendMessage(e)}>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
