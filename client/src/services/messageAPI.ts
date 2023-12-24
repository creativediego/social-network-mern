import axios from 'axios';
import { IConversation } from '../interfaces/IConversation';
import { IMessage } from '../interfaces/IMessage';
import { loadRequestInterceptors, callAPI, Requests } from '../util/apiConfig';
import { config } from '../config/appConfig';

const MESSAGES_API = `${config.apiURL}/users`;

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
) =>
  callAPI<IMessage, { message: string }>(
    `${MESSAGES_API}/${userId}/conversations/${conversationId}/messages`,
    Requests.POST,
    'Error sending message. Try again later.',
    { message }
  );

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
) =>
  callAPI<IConversation, IConversation>(
    `${MESSAGES_API}/${userId}/conversations`,
    Requests.POST,
    'Error creating conversation. Try again later.',
    conversation
  );

/**
 * Finds the latest messages per conversation for the specified user.
 * This corresponds what the messages inbox is, where the latest messages are by
 * conversation regardless of who sent the last message per conversation.
 * Uses the mongo aggregate functionality to filter and sort through conversations/messages
 * and to format the returned output.
 */
export const findInboxMessages = async (userId: string) =>
  callAPI<IMessage[]>(
    `${MESSAGES_API}/${userId}/messages/`,
    Requests.GET,
    'Error fetching inbox messages. Try again later.'
  );

export const findConversation = async (
  userId: string,
  conversationId: string
) =>
  callAPI<IConversation>(
    `${MESSAGES_API}/${userId}/conversations/${conversationId}`,
    Requests.GET,
    'Error fetching conversation. Try again later.'
  );

/**
 * Find all messages for conversation for the specified user and conversation ids.
 * Also check if user if indeed a participant in the conversation for security reasons.
 * @param userId id of the user requesting the latest messages
 * @param conversationId the id of the conversation*/

export const findMessagesByConversation = async (
  userId: string,
  conversationId: string
) =>
  callAPI<IMessage[]>(
    `${MESSAGES_API}/${userId}/conversations/${conversationId}/messages`,
    Requests.GET,
    'Error fetching messages. Try again later.'
  );

/**
 * Finds all the messages sent by the specified user.
 */
export const findAllMessagesSentByUser = async (userId: string) =>
  callAPI<IMessage[]>(
    `${MESSAGES_API}/${userId}/messages/sent`,
    Requests.GET,
    'Error fetching messages. Try again later.'
  );

/**
 * Remove a message for a particular user by finding the message in the database,
 * and placing the user id in the array of removedFor. The message is not technically deleted,
 * and the user is placed in the array of people for whom the message is no longer visible.
 * @param userId id of the user requesting the latest messages
 * @param messageId id of the message
 * @returns {Promise<{message}>} the deleted message
 */
export const deleteMessage = async (userId: string, messageId: string) =>
  callAPI<IMessage>(
    `${MESSAGES_API}/${userId}/messages/${messageId}`,
    Requests.DELETE,
    'Error deleting message. Try again later.'
  );

/**
 * Remove a conversation between user(s)
 * @param userId id of the user requesting the latest messages
 * @param conversationId id of the conversation
 * @returns {Promise<{IConversation}>} the deleted conversation
 */
export const deleteConversation = async (
  userId: string,
  conversationId: string
) =>
  callAPI<IConversation>(
    `${MESSAGES_API}/${userId}/conversations/${conversationId}`,
    Requests.DELETE,
    'Error deleting conversation. Try again later.'
  );
