import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import { IChat } from '../interfaces/IChat';
import { IMessage } from '../interfaces/IMessage';
import { IUser } from '../interfaces/IUser';
import { chatService } from '../services/chatService';
import type { RootState } from './store';
import { withErrorHandling } from './reduxErrorHandler';

/**
 * Fetch a specific chat and all messages related to it.
 */
export const findMessagesByChat = createAsyncThunk(
  'chat/findAllMessages',
  async (chatId: string, _) => {
    const chat = await chatService.findChat(chatId);
    const messages = await chatService.findMessagesByChat(chatId);
    return { chat, messages };
  }
);

/**
 * Post a new message.
 */
export const sendMessage = createAsyncThunk(
  'chat/send',
  async (content: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const chatId = state.chat.id;
    const message: IMessage = {
      id: '',
      chatId,
      content,
      sender: state.user.data,
      recipients: [],
      readBy: [],
      deletedBy: [],
      createdAt: '',
    };

    const newMessage = await chatService.sendMessage(message);
    return newMessage;
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/message/delete',
  async (message: IMessage, ThunkAPI) => {
    const deletedMessage = await chatService.deleteMessage(message);
    return deletedMessage;
  }
);

// /**
//  * Create a new chat.
//  */
export const createChatThunk = createAsyncThunk(
  'messages/createChat',
  async (chat: IChat, ThunkAPI) => {
    const newChat = await chatService.createChat(chat);
    return newChat;
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
    builder.addCase(deleteMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      deleteMessage.fulfilled,
      (state, action: PayloadAction<IMessage>) => {
        state.loading = false;
        chatAdapter.removeOne(state, action.payload.id);
      }
    );
    builder.addCase(deleteMessage.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(findMessagesByChat.pending, (state) => {
      state.loading = true;
      chatAdapter.removeAll(state);
      participantsAdapter.removeAll(state.participants);
    });
    builder.addCase(
      findMessagesByChat.fulfilled,
      (
        state,
        action: PayloadAction<{
          chat: IChat;
          messages: IMessage[];
        }>
      ) => {
        state.loading = false;
        chatAdapter.setAll(state, action.payload.messages);
        state.id = action.payload.chat.id;
        participantsAdapter.setAll(
          state.participants,
          action.payload.chat.participants
        );
      }
    );
    builder.addCase(findMessagesByChat.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(sendMessage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      sendMessage.fulfilled,
      (state, action: PayloadAction<IMessage>) => {
        state.id = action.payload.chatId;
        state.loading = false;
        chatAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(sendMessage.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(createChatThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createChatThunk.fulfilled,
      (state, action: PayloadAction<IChat>) => {
        state.loading = false;
        state.id = action.payload.id;
        chatAdapter.removeAll(state);
        participantsAdapter.setAll(
          state.participants,
          action.payload.participants
        );
      }
    );
    builder.addCase(createChatThunk.rejected, (state) => {
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

export const findMessagesByChatThunk = withErrorHandling(findMessagesByChat);
export const sendMessageThunk = withErrorHandling(sendMessage);
export const deleteMessageThunk = withErrorHandling(deleteMessage);
export const createChat = withErrorHandling(createChatThunk);

export default chatSlice.reducer;
