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

/**
 * Fetch a specific chat and all messages related to it.
 */
export const findMessagesByChat = createAsyncThunk(
  'chat/findAllMessages',
  async (chatId: string, ThunkAPI) => {
    // Get the chat meta data and messages
    const chat = await chatService.findChat(chatId);
    const messages = await chatService.findMessagesByChat(chatId);
    // Mark chat as read in local state
    ThunkAPI.dispatch(removeUnreadChatId(chatId));
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
    const recipients = state.chat.participantIds;

    const message: IMessage = {
      id: '',
      chatId,
      content,
      sender: state.user.data,
      recipients: recipients,
      readBy: [state.user.data.id],
      deletedBy: [],
      createdAt: '',
    };

    const newMessage = await chatService.sendMessage(message);
    return newMessage;
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/message/delete',
  async (messageId: string, ThunkAPI) => {
    const deletedMessage = await chatService.deleteMessage(messageId);
    return deletedMessage;
  }
);

// /**
//  * Create a new chat.
//  */
export const createChatThunk = createAsyncThunk(
  'messages/createChat',
  async (chat: IChat, _) => {
    const newChat = await chatService.createChat(chat);
    return newChat;
  }
);

export const getUnreadChatCountThunk = createAsyncThunk(
  'chat/getUnreadChatCount',
  async (_, ThunkAPI) => {
    const count = await chatService.getUnreadChatCount();
    return count;
  }
);

export const getUnreadChatIdsThunk = createAsyncThunk(
  'chat/getUnreadChatIds',
  async (_, ThunkAPI) => {
    const ids = await chatService.getUnreadChatIds();
    return ids;
  }
);

export const markMessageReadThunk = createAsyncThunk(
  'chat/markMessageRead',
  async (message: IMessage, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    // If the message is in the current chat, mark it as read
    if (state.chat.id === message.chatId) {
      const readMessage = await chatService.markMessageRead(message.id);
    }
    return;
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
    participantIds: [] as string[],
    loading: false,
    unreadChatCount: 0,
    unreadChatIds: [] as string[],
  }),
  reducers: {
    upsertChatMessage: (state, action: PayloadAction<IMessage>) => {
      if (state.id === action.payload.chatId) {
        chatAdapter.upsertOne(state, action.payload);
      }
      if (state.id !== action.payload.chatId) {
        if (!state.unreadChatIds.includes(action.payload.chatId)) {
          state.unreadChatIds.push(action.payload.chatId);
        }
      }
    },
    clearChat: (state) => {
      chatAdapter.removeAll(state);
      state.id = '';
    },
    removeUnreadChatId: (state, action: PayloadAction<string>) => {
      state.unreadChatIds = state.unreadChatIds.filter(
        (id) => id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(markMessageReadThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(markMessageReadThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(markMessageReadThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(getUnreadChatCountThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getUnreadChatIdsThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(
      getUnreadChatIdsThunk.fulfilled,
      (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.unreadChatIds = action.payload;
      }
    );

    builder.addCase(getUnreadChatIdsThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(
      getUnreadChatCountThunk.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.unreadChatCount = action.payload;
      }
    );

    builder.addCase(getUnreadChatCountThunk.rejected, (state) => {
      state.loading = false;
    });

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
        state.participantIds = action.payload.chat.participants.map(
          (participant) => participant.id
        );
        state.unreadChatCount -= 1;
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

export const selectChatParticipants = createSelector(
  (state: RootState) => state.chat,
  (chat) => chat.participants.ids.map((id) => chat.participants.entities[id])
);

export const selectUnreadChatCount = createSelector(
  (state: RootState) => state.chat,
  (chat) => chat.unreadChatIds.length
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
export const { upsertChatMessage, clearChat, removeUnreadChatId } =
  chatSlice.actions;

export const findMessagesByChatThunk = findMessagesByChat;
export const sendMessageThunk = sendMessage;
export const deleteMessageThunk = deleteMessage;
export const createChat = createChatThunk;

export default chatSlice.reducer;
