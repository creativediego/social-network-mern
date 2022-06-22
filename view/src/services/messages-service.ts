import axios from 'axios';
import { IConversation } from '../interfaces/IConversation';
import { IMessage } from '../interfaces/IMessage';
import { loadRequestInterceptors } from './helpers';
import { processError } from './helpers';

const BASE_URL = process.env.REACT_APP_API_URL;
const MESSAGES_API = `${BASE_URL}/users`;

const api = axios.create();
// api.defaults.headers.common['authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);
/**
 * Create a new message for an existing conversation by using the existing
 * id of the conversation this message belongs to. Also interact with the
 * ConversationModel to check if sender is a participant in the conversation.
 * If so, then call the MessageModel to create the message.
 */
export const sendMessage = async (
  userId: string,
  conversationId: string,
  message: string
): Promise<IMessage> => {
  try {
    const res = await api.post(
      `${MESSAGES_API}/${userId}/conversations/${conversationId}/messages`,
      { message }
    );
    return res.data;
  } catch (err) {
    return processError(err);
  }
};

/**
 * Create a conversation document.
 * @param userId id of the user requesting the latest messages
 * @param conversationId sorted concatenation of all participant ids
 * @param conversation conversation object
 * @returns {Promise<{conversation}>} the conversation object or error
 */
export const createConversation = async (
  userId: string,
  conversation: IConversation
): Promise<IConversation> => {
  try {
    const res = await api.post(
      `${MESSAGES_API}/${userId}/conversations`,
      conversation
    );
    return res.data;
  } catch (err) {
    return processError(err);
  }
};

/**
 * Finds the latest messages per conversation for the specified user.
 * This corresponds what the messages inbox is, where the latest messages are by
 * conversation regardless of who sent the last message per conversation.
 * Uses the mongo aggregate functionality to filter and sort through conversations/messages
 * and to format the returned output.
 * @param userId id of the user requesting the latest messages
 * @returns {Promise<[{message}]>} an array of message objects */
export const findInboxMessages = async (
  userId: string
): Promise<IConversation[]> => {
  try {
    const res = await api.get(`${MESSAGES_API}/${userId}/messages/`);
    return res.data;
  } catch (err) {
    return processError(err);
  }
};
export const findConversation = async (
  userId: string,
  conversationId: string
): Promise<IConversation> => {
  try {
    const res = await api.get(
      `${MESSAGES_API}/${userId}/conversations/${conversationId}`
    );
    return res.data;
  } catch (err) {
    return processError(err);
  }
};

/**
 * Find all messages for conversation for the specified user and conversation ids.
 * Also check if user if indeed a participant in the conversation for security reasons.
 * @param userId id of the user requesting the latest messages
 * @param conversationId the id of the conversation
 * @returns {Promise<IMessage[]>} an array of message objects */

export const findMessagesByConversation = async (
  userId: string,
  conversationId: string
): Promise<IMessage[]> => {
  try {
    const res = await api.get(
      `${MESSAGES_API}/${userId}/conversations/${conversationId}/messages`
    );
    return res.data;
  } catch (err) {
    return processError(err);
  }
};

/**
 * Finds all the messages sent by the specified user.
 * @param userId id of the user requesting the latest messages
 * @returns {Promise<[{message}]>} an array of message objects */
export const findAllMessagesSentByUser = async (
  userId: string
): Promise<IMessage[]> => {
  try {
    const res = await api.get(`${MESSAGES_API}/${userId}/messages/sent`);
    return res.data;
  } catch (err) {
    return processError(err);
  }
};

/**
 * Remove a message for a particular user by finding the message in the database,
 * and placing the user id in the array of removedFor. The message is not technically deleted,
 * and the user is placed in the array of people for whom the message is no longer visible.
 * @param userId id of the user requesting the latest messages
 * @param messageId id of the message
 * @returns {Promise<{message}>} the deleted message
 */
export const deleteMessage = async (
  userId: string,
  messageId: string
): Promise<IMessage> => {
  try {
    const res = await api.delete(
      `${MESSAGES_API}/${userId}/messages/${messageId}`
    );
    return res.data;
  } catch (err) {
    return processError(err);
  }
};

/**
 * Remove a conversation between user(s)
 * @param userId id of the user requesting the latest messages
 * @param conversationId id of the conversation
 * @returns {Promise<{IConversation}>} the deleted conversation
 */
export const deleteConversation = async (
  userId: string,
  conversationId: string
): Promise<IConversation> => {
  try {
    const res = await api.delete(
      `${MESSAGES_API}/${userId}/conversations/${conversationId}`
    );
    return res.data;
  } catch (err) {
    return processError(err);
  }
};
