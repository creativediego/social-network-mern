import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IConversation } from '../interfaces/IConversation';
import { IMessage } from '../interfaces/IMessage';
import * as messageAPI from '../services/messages-service';
import type { RootState } from './store';
import { dataOrThrowError } from './helpers';

/**
 * Fetch inbox messages.
 */
export const findInboxMessagesThunk = createAsyncThunk(
  'messages/findInbox',
  async (data, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    let inboxMessages = await messageAPI.findInboxMessages(userId);
    inboxMessages = dataOrThrowError(inboxMessages, ThunkAPI.dispatch);
    return inboxMessages;
  }
);

export const deleteConversationThunk = createAsyncThunk(
  'messages/deleteConversation',
  async (conversationId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const deletedConversation = await messageAPI.deleteConversation(
      userId,
      conversationId
    );
    return dataOrThrowError(deletedConversation, ThunkAPI.dispatch);
  }
);

/**
 * Manages the state dealing with messages, including inbox and current active chat.
 */
const inboxAdapter = createEntityAdapter<IMessage>({
  selectId: (message: IMessage) => message.conversationId!,
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
    builder.addCase(deleteConversationThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteConversationThunk.fulfilled,
      (state, action: PayloadAction<IConversation>) => {
        state.loading = false;
        inboxAdapter.removeOne(state, action.payload.id);
      }
    );
    builder.addCase(deleteConversationThunk.rejected, (state) => {
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
        if (message.readFor && !message.readFor.includes(userId)) {
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
