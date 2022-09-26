import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import {
  selectChatLoading,
  findMessagesByConversationThunk,
  selectAllParticipants,
} from '../../../redux/chatSlice';
import { Link } from 'react-router-dom';
import { FormInput } from '../../../forms';
// @ts-ignore
import Message from './Message';
import { selectAllChatMessages } from '../../../redux/chatSlice';

/**
 * Displays the active chat window with all its messages and send message text area.
 *
 */
const useChat = (conversationId: string) => {
  console.log('useChat', conversationId);
  const dispatch = useAppDispatch();
  // const userId = useAppSelector((state) => state.user.data.id);
  // const loading = useAppSelector((state) => state.messages.loading);
  const messages = useAppSelector(selectAllChatMessages);
  const loading = useAppSelector(selectChatLoading);
  const participants = useAppSelector(selectAllParticipants);
  // const [newMessageBody, setNewMessageBody] = useState({
  //   sender: userId,
  //   conversationId,
  //   message: '',
  // });
  // const chatWindowRef = useRef(null);

  useEffect(() => {
    dispatch(findMessagesByConversationThunk(conversationId));
  }, [dispatch, conversationId]);

  // useLayoutEffect(() => {
  //   if (!loading) {
  //     scrollToBottom();
  //   }
  // });

  // const sendMessage = (e: any) => {
  //   e.preventDefault();
  //   setNewMessageBody({ ...newMessageBody, message: '' });
  //   dispatch(sendMessageThunk(newMessageBody));
  // };

  // const scrollToBottom = () => {
  //   chatWindowRef.current.scrollIntoView({
  //     // behavior: 'smooth',
  //     block: 'end',
  //     inline: 'nearest',
  //   });
  // };

  return { messages, participants, loading };
};

export default useChat;
