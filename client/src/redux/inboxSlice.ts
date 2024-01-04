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
import { withErrorHandling } from './reduxErrorHandler';

/**
 * Fetch inbox messages.
 */
export const findInboxMessages = createAsyncThunk(
  'messages/findInbox',
  async (_, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const inboxMessages = await chatService.findInboxMessages(userId);
    return inboxMessages;
  }
);

export const deleteInboxChat = createAsyncThunk(
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
export const { updateInbox } = messageInboxSlice.actions;

export const findInboxMessagesThunk = withErrorHandling(findInboxMessages);
export const deleteInboxChatThunk = withErrorHandling(deleteInboxChat);

export default messageInboxSlice.reducer;
