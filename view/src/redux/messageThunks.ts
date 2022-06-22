import { createAsyncThunk } from '@reduxjs/toolkit';
import * as messageAPI from '../services/messages-service';
import { dataOrStateError } from './helpers';
import { findAllByName } from '../services/users-service';
import { IConversation } from '../interfaces/IConversation';
import type { RootState } from './store';

/**
 * The following thunks call the messages API for different CRUD operations and to return the data to the messages slice where state is updated.
 */

/**
 * Fetch inbox messages.
 */
export const findInboxMessagesThunk = createAsyncThunk(
  'messages/findInbox',
  async (data, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    let inboxMessages = await messageAPI.findInboxMessages(userId);
    return dataOrStateError(inboxMessages, ThunkAPI);
  }
);

/**
 * Fetch a specific conversation and all messages related to it.
 */
export const findMessagesByConversationThunk = createAsyncThunk(
  'messages/findMessagesByConversation',
  async (conversationId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    let conversation = await messageAPI.findConversation(
      userId,
      conversationId
    );
    let messages = await messageAPI.findMessagesByConversation(
      userId,
      conversationId
    );
    conversation = dataOrStateError(conversation, ThunkAPI);
    messages = dataOrStateError(messages, ThunkAPI);
    return { conversation, messages };
  }
);

/**
 * Post a new message.
 */
export const sendMessageThunk = createAsyncThunk(
  'messages/sendMessage',
  async (
    {
      sender,
      conversationId,
      message,
    }: { sender: string; conversationId: string; message: string },
    ThunkAPI
  ) => {
    const newMessage = await messageAPI.sendMessage(
      sender,
      conversationId,
      message
    );
    // ThunkAPI.dispatch(findMessagesByConversationThunk(conversationId));
    // push message to front of array in state
    return dataOrStateError(newMessage, ThunkAPI);
  }
);
/**
 * Post a new conversation.
 */
export const createConversationThunk = createAsyncThunk(
  'messages/createConversation',
  async (conversation: IConversation, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const newConversation = await messageAPI.createConversation(
      userId,
      conversation
    );
    return dataOrStateError(newConversation, ThunkAPI);
  }
);

/**
 * Find all users by name or username for new potential chat.
 */
export const findUsersByNameThunk = createAsyncThunk(
  'users/findAllByName',
  async (nameOrUsername: string, ThunkAPI) => {
    const users = await findAllByName(nameOrUsername);
    return dataOrStateError(users, ThunkAPI);
  }
);
