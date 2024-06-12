/**
 * This module defines the inbox slice of the Redux store for managing inbox messages in the application.
 *
 * The inbox slice of the store uses the `createEntityAdapter` function from Redux Toolkit to generate a set of reducer functions and selectors.
 *
 * The `IChat` and `IMessage` interfaces define the shape of the chat and message data respectively.
 *
 * The `chatService` is used to interact with the chat API.
 *
 * The `findInboxMessages` async thunk fetches the inbox messages for the current user.
 *
 * The `deleteInboxChat` async thunk deletes a specific chat from the inbox.
 *
 * The `markChatAsRead` async thunk marks a specific chat as read.
 *
 * The `markChatAsUnread` async thunk marks a specific chat as unread.
 *
 * @module inboxSlice
 * @see {@link createEntityAdapter} for the function that generates a set of reducer functions and selectors.
 * @see {@link createSlice} for the function that generates the slice.
 * @see {@link PayloadAction} for the type of all dispatched actions.
 * @see {@link createSelector} for the function that creates memoized selectors.
 * @see {@link IChat} for the type of the chat data.
 * @see {@link IMessage} for the type of the message data.
 * @see {@link chatService} for the service that interacts with the chat API.
 * @see {@link RootState} for the type of the root state.
 */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IChat } from '../interfaces/IChat';
import { IMessage } from '../interfaces/IMessage';
import type { RootState } from './store';
import { chatService } from '../services/chatService';
import { removeUnreadChatId } from './chatSlice';

/**
 * Fetch inbox messages.
 */
export const findInboxMessages = createAsyncThunk(
  'messages/findInbox',
  async (_, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const inboxMessages = await chatService.findInboxChats(userId);
    return inboxMessages;
  }
);

export const deleteInboxChat = createAsyncThunk(
  'messages/deleteInboxChat',
  async (chatId: string, ThunkAPI) => {
    const delChat = await chatService.deleteChat(chatId);
    ThunkAPI.dispatch(removeUnreadChatId(chatId));
    return delChat;
  }
);

/**
 * Manages the state dealing with messages, including inbox and current active chat.
 */
const inboxAdapter = createEntityAdapter<IMessage>({
  selectId: (message: IMessage) => message.chatId!,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const messageInboxSlice = createSlice({
  name: 'messagesInbox',
  initialState: inboxAdapter.getInitialState({
    loading: false,
    unreadCount: 0,
  }),
  reducers: {
    addInboxMessage: (state, action: PayloadAction<IMessage>) => {
      inboxAdapter.upsertOne(state, action.payload);
    },
    decreaseUnreadCount: (state) => {
      state.unreadCount--;
    },
    clearInbox: (state) => {
      inboxAdapter.removeAll(state);
    },
  },
  // Manages the async call states for creating conversations.
  extraReducers: (builder) => {
    builder.addCase(findInboxMessages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findInboxMessages.fulfilled,
      (state, action: PayloadAction<IMessage[]>) => {
        state.loading = false;
        inboxAdapter.upsertMany(state, action.payload);
      }
    );
    builder.addCase(findInboxMessages.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteInboxChat.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteInboxChat.fulfilled,
      (state, action: PayloadAction<IChat>) => {
        state.loading = false;
        inboxAdapter.removeOne(state, action.payload.id);
      }
    );
    builder.addCase(deleteInboxChat.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const inboxLoadingSelector = createSelector(
  (state: RootState) => state.messagesInbox,
  (inbox) => inbox.loading
);

export const selectUnreadCount = createSelector(
  (state: RootState) => state,
  (state) => {
    const userId = state.user.data.id;
    let unreadCount = 0;
    inboxAdapter
      .getSelectors()
      .selectAll(state.messagesInbox)
      .forEach((message) => {
        if (message.readBy && !message.readBy.includes(userId)) {
          unreadCount++;
        }
      });
    return unreadCount;
  }
);

export const { selectAll: selectAllInboxMessages } = inboxAdapter.getSelectors(
  (state: RootState) => state.messagesInbox
);
export const { addInboxMessage, clearInbox } = messageInboxSlice.actions;

export const findInboxMessagesThunk = findInboxMessages;
export const deleteInboxChatThunk = deleteInboxChat;

export default messageInboxSlice.reducer;
