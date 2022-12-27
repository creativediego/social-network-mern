import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { IConversation } from '../interfaces/IConversation';
import { IMessage } from '../interfaces/IMessage';
import { IUser } from '../interfaces/IUser';
import { dataOrStateError as getDataOrError } from './helpers';
import * as messageAPI from '../services/messages-service';
import type { RootState } from './store';

/**
 * Fetch a specific conversation and all messages related to it.
 */
export const findMessagesByConversationThunk = createAsyncThunk(
  'chat/findAllMessages',
  async (conversationId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;

    const conversationOrError = await messageAPI.findConversation(
      userId,
      conversationId
    );
    const messagesOrError = await messageAPI.findMessagesByConversation(
      userId,
      conversationId
    );
    const conversation = getDataOrError(conversationOrError, ThunkAPI.dispatch);
    const messages = getDataOrError(messagesOrError, ThunkAPI.dispatch);
    return { conversation, messages };
  }
);

/**
 * Post a new message.
 */
export const sendMessageThunk = createAsyncThunk(
  'chat/send',
  async (
    {
      sender,
      conversationId,
      message,
    }: { sender: string; conversationId: string; message: string },
    ThunkAPI
  ) => {
    const state = ThunkAPI.getState() as RootState;
    const chatId = state.chat.id;
    const newMessage = await messageAPI.sendMessage(sender, chatId, message);
    return getDataOrError(newMessage, ThunkAPI.dispatch);
  }
);

export const deleteMessageThunk = createAsyncThunk(
  'chat/delete',
  async (
    { userId, messageId }: { userId: string; messageId: string },
    ThunkAPI
  ) => {
    const deletedMessage = await messageAPI.deleteMessage(userId, messageId);
    return getDataOrError(deletedMessage, ThunkAPI.dispatch);
  }
);

// /**
//  * Post a new conversation.
//  */
export const createConversationThunk = createAsyncThunk(
  'messages/createConversation',
  async (conversation: IConversation, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const newConversation = await messageAPI.createConversation(
      userId,
      conversation
    );
    return getDataOrError(newConversation, ThunkAPI.dispatch);
  }
);

/**
 * Manages the state dealing with messages, including inbox and current active chat.
 */

const chatAdapter = createEntityAdapter<IMessage>({
  selectId: (message: IMessage) => message.id,
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});
const participantsAdapter = createEntityAdapter<IUser>({
  selectId: (user: IUser) => user.id,
  sortComparer: (a, b) => b.username.localeCompare(a.username),
});
const chatSlice = createSlice({
  name: 'chat',
  initialState: chatAdapter.getInitialState({
    id: '',
    participants: participantsAdapter.getInitialState(),
    loading: false,
  }),
  reducers: {
    upsertChatMessage: (state, action: PayloadAction<IMessage>) => {
      chatAdapter.upsertOne(state, action.payload);
    },
    clearChat: (state) => {
      chatAdapter.removeAll(state);
      state.id = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(deleteMessageThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteMessageThunk.fulfilled,
      (state, action: PayloadAction<IMessage>) => {
        state.loading = false;
        chatAdapter.removeOne(state, action.payload.id);
      }
    );
    builder.addCase(deleteMessageThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(findMessagesByConversationThunk.pending, (state) => {
      state.loading = true;
      chatAdapter.removeAll(state);
      participantsAdapter.removeAll(state.participants);
    });
    builder.addCase(
      findMessagesByConversationThunk.fulfilled,
      (
        state,
        action: PayloadAction<{
          conversation: IConversation;
          messages: IMessage[];
        }>
      ) => {
        state.loading = false;
        chatAdapter.setAll(state, action.payload.messages);
        state.id = action.payload.conversation.id;
        participantsAdapter.setAll(
          state.participants,
          action.payload.conversation.participants
        );
      }
    );
    builder.addCase(findMessagesByConversationThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(sendMessageThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      sendMessageThunk.fulfilled,
      (state, action: PayloadAction<IMessage>) => {
        state.id = action.payload.conversationId;
        state.loading = false;
        chatAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(sendMessageThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(createConversationThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createConversationThunk.fulfilled,
      (state, action: PayloadAction<IConversation>) => {
        state.loading = false;
        state.id = action.payload.id;
        chatAdapter.removeAll(state);
        participantsAdapter.setAll(
          state.participants,
          action.payload.participants
        );
      }
    );
    builder.addCase(createConversationThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});
export const selectActiveChatId = createSelector(
  (state: RootState) => state.chat,
  (chat) => chat.id
);

export const selectChatLoading = createSelector(
  (state: RootState) => state.chat,
  (chat) => chat.loading
);

export const { selectAll: selectAllChatMessages } = chatAdapter.getSelectors(
  (state: RootState) => state.chat
);
export const { selectAll: selectAllParticipants } =
  participantsAdapter.getSelectors(
    (state: RootState) => state.chat.participants
  );
export const { upsertChatMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
