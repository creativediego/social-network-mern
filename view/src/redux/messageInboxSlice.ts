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
import { RootState } from './store';
import { dataOrStateError } from './helpers';

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

export const deleteConversationThunk = createAsyncThunk(
  'messages/deleteConversation',
  async (conversationId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const deletedConversation = await messageAPI.deleteConversation(
      userId,
      conversationId
    );
    return dataOrStateError(deletedConversation, ThunkAPI);
  }
);

/**
 * Manages the state dealing with messages, including inbox and current active chat.
 */
const inboxAdapter = createEntityAdapter<IMessage>({
  selectId: (message: IMessage) => message.conversationId,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const messageInboxSlice = createSlice({
  name: 'messagesInbox',
  initialState: inboxAdapter.getInitialState({ loading: false }),
  reducers: {
    updateInbox: (state, action: PayloadAction<IMessage>) => {
      inboxAdapter.upsertOne(state, action.payload);
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

export const { selectAll: selectAllInboxMessages } = inboxAdapter.getSelectors(
  (state: RootState) => state.messagesInbox
);
export const { updateInbox } = messageInboxSlice.actions;
export default messageInboxSlice.reducer;
