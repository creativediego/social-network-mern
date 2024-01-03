import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IChat } from '../interfaces/IChat';
import { IMessage } from '../interfaces/IMessage';
import * as messageAPI from '../services/chatAPI';
import type { RootState } from './store';
import { logToConsole } from '../util/logToConsole';
import { chatService } from '../services/chatService';

/**
 * Fetch inbox messages.
 */
export const findInboxMessagesThunk = createAsyncThunk(
  'messages/findInbox',
  async (data, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const inboxMessages = await messageAPI.findInboxMessages(userId);
    logToConsole('INBOX', inboxMessages);
    return inboxMessages;
  }
);

export const deleteInboxChatThunk = createAsyncThunk(
  'messages/deleteInboxChat',
  async (chatId: string, _) => {
    const delChat = await chatService.deleteChat(chatId);
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
    updateInbox: (state, action: PayloadAction<IMessage>) => {
      inboxAdapter.upsertOne(state, action.payload);
    },
    decreaseUnreadCount: (state) => {
      state.unreadCount--;
    },
  },
  // Manages the async call states for creating conversations.
  extraReducers: (builder) => {
    builder.addCase(findInboxMessagesThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findInboxMessagesThunk.fulfilled,
      (state, action: PayloadAction<IMessage[]>) => {
        state.loading = false;
        inboxAdapter.upsertMany(state, action.payload);
      }
    );
    builder.addCase(findInboxMessagesThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteInboxChatThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteInboxChatThunk.fulfilled,
      (state, action: PayloadAction<IChat>) => {
        state.loading = false;
        inboxAdapter.removeOne(state, action.payload.id);
      }
    );
    builder.addCase(deleteInboxChatThunk.rejected, (state) => {
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
export const { updateInbox } = messageInboxSlice.actions;
export default messageInboxSlice.reducer;
