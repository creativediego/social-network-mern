import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation } from '../interfaces/IConversation';
import { IMessage } from '../interfaces/IMessage';
import { IUser } from '../interfaces/IUser';
import {
  findInboxMessagesThunk,
  findMessagesByConversationThunk,
  sendMessageThunk,
  createConversationThunk,
  findUsersByNameThunk,
} from './messageThunks';

interface MessageState {
  inbox: IMessage[];
  loading: boolean;
  activeChat: {
    id: string;
    messages: IMessage[];
    participants: IUser[];
  };
  foundUsersForNewChat: IUser[];
}

const initialState: MessageState = {
  inbox: [],
  loading: false,
  activeChat: {
    id: '',
    messages: [],
    participants: [],
  },
  foundUsersForNewChat: [],
};
/**
 * Manages the state dealing with messages, including inbox and current active chat.
 */
const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    // Sets the state of the current active chat/conversation.
    setActiveChat: (state, action) => {
      const conversation = action.payload;
      state.activeChat.id = conversation.id;
      state.activeChat.participants = conversation.participants;
    },
    updateChat: (state, action: PayloadAction<IMessage>) => {
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
  extraReducers: (builder) => {
    builder.addCase(createConversationThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createConversationThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createConversationThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findInboxMessagesThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(findInboxMessagesThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(findInboxMessagesThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findMessagesByConversationThunk.pending, (state) => {
      state.loading = true;
      state.activeChat.messages = [];
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
        state.activeChat.messages = action.payload.messages;
        state.activeChat.id = action.payload.conversation.id;
        state.activeChat.participants =
          action.payload.conversation.participants;
      }
    );
    builder.addCase(findMessagesByConversationThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(sendMessageThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(sendMessageThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(sendMessageThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findUsersByNameThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findUsersByNameThunk.fulfilled,
      (state, action: PayloadAction<IUser[]>) => {
        state.loading = false;
        state.foundUsersForNewChat = action.payload;
      }
    );
    builder.addCase(findUsersByNameThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});
export const { setActiveChat, updateChat, clearFoundUsers } =
  messageSlice.actions;
export default messageSlice.reducer;
