import { createSlice } from '@reduxjs/toolkit';
import {
  findInboxMessagesThunk,
  findMessagesByConversationThunk,
  sendMessageThunk,
  createConversationThunk,
  findUsersByNameThunk,
} from './messageThunks';

/**
 * Manages the state dealing with messages, including inbox and current active chat.
 */
const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    inbox: [],
    loading: false,
    activeChat: {
      id: undefined,
      messages: [],
      participants: [],
    },
    foundUsersForNewChat: [],
  },
  reducers: {
    // Sets the state of the current active chat/conversation.
    setActiveChat: (state, action) => {
      const conversation = action.payload;
      state.activeChat.id = conversation.id;
      state.activeChat.participants = conversation.participants;
    },
    updateChat: (state, action) => {
      const conversation = action.payload.conversation.id;
      if (
        conversation === state.activeChat.id && // same convo
        !state.activeChat.messages.includes(action.payload) // message not in chat
      ) {
        state.activeChat.messages.push(action.payload);
      }
    },
    clearFoundUsers: (state) => {
      state.foundUsersForNewChat = [];
    },
  },
  // Manages the async call states for creating conversations.
  extraReducers: {
    [createConversationThunk.pending]: (state) => {
      state.loading = true;
    },
    [createConversationThunk.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [createConversationThunk.rejected]: (state, action) => {
      state.loading = false;
    },

    // Async states of the async thunk for fetching inbox.
    [findInboxMessagesThunk.pending]: (state) => {
      state.loading = true;
    },
    [findInboxMessagesThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.inbox = action.payload;
    },
    [findInboxMessagesThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    // States for fetching all conversations of a chat.
    [findMessagesByConversationThunk.pending]: (state) => {
      state.loading = true;
      state.activeChat.messages = [];
    },
    [findMessagesByConversationThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.activeChat.messages = action.payload.messages;
      state.activeChat.id = action.payload.conversation.id;
      state.activeChat.participants = action.payload.conversation.participants;
    },
    [findMessagesByConversationThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    // Async states of sendMessageThunk
    [sendMessageThunk.pending]: (state) => {
      state.loading = true;
    },
    [sendMessageThunk.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [sendMessageThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    [findUsersByNameThunk.pending]: (state, action) => {
      state.loading = false;
    },
    [findUsersByNameThunk.rejected]: (state) => {
      state.loading = false;
    },
    [findUsersByNameThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.foundUsersForNewChat = action.payload;
    },
  },
});
export const { setActiveChat, updateChat, clearFoundUsers } =
  messageSlice.actions;
export default messageSlice.reducer;
