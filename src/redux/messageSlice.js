import { createSlice } from '@reduxjs/toolkit';
import {
  findInboxMessagesThunk,
  findMessagesByConversationThunk,
  sendMessageThunk,
  createConversationThunk,
} from './messageThunks';

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    inbox: [],
    activeChat: {
      id: undefined,
      messages: [],
    },
  },
  reducers: {
    // updateMessages: (state, acFindUtion) => {
    //   const message = action.payload;
    //   state.inbox.unshift(message);
    //   if (message.conversation === state.activeChat.id)
    //     state.activeChat.messages.unshift(message);
    // },
    // updateActiveChat: (state, action) => {
    //   const message = action.payload;
    //   console.log('update active chat reducer', message);
    //   if (message.conversation === state.activeChat.id)
    //     state.activeChat.messages.unshift(message);
    // },
    setActiveChat: (state, action) => {
      const conversation = action.payload;
      console.log('setting active chat', conversation);
      state.activeChat.id = conversation.id;
    },
  },
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

    // for the async thunks
    [findInboxMessagesThunk.pending]: (state) => {
      state.loading = true;
    },
    [findInboxMessagesThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.inbox = action.payload;
      console.log('all messages fulfilled', state.inbox);
      // messagesAPI.listenOnConversations(state.inbox);
    },
    [findInboxMessagesThunk.rejected]: (state, action) => {
      state.loading = false;
      console.log('all messages rejected');
    },
    [findMessagesByConversationThunk.pending]: (state) => {
      state.loading = true;
    },
    [findMessagesByConversationThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.activeChat.messages = action.payload;
      // state.activeChat.id = state.activeChat.messages[0].conversation;
      console.log(
        'messages by conversation fulfilled',
        state.activeChat.messages
      );
    },
    [findMessagesByConversationThunk.rejected]: (state, action) => {
      state.loading = false;
      console.log('messages by conversation  rejected');
    },
    [sendMessageThunk.pending]: (state) => {
      state.loading = true;
    },
    [sendMessageThunk.fulfilled]: (state, action) => {
      state.loading = false;

      console.log('send message fulfilled', state.inbox);
      // messagesAPI.listenOnConversations(state.inbox);
    },
    [sendMessageThunk.rejected]: (state, action) => {
      state.loading = false;
      console.log('send message rejected');
    },
  },
});
export const { updateActiveChat, setActiveChat } = messageSlice.actions;
export default messageSlice.reducer;
