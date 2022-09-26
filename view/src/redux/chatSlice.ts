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
import {
  findInboxMessagesThunk,
  sendMessageThunk,
  createConversationThunk,
  findUsersByNameThunk,
} from './messageThunks';
import { dataOrStateError } from './helpers';
import * as messageAPI from '../services/messages-service';
import { RootState } from './store';

// interface MessageState {
//   inbox: IMessage[];
//   loading: boolean;
//   activeChat: {
//     id: string;
//     messages: IMessage[];
//     participants: IUser[];
//   };
//   foundUsersForNewChat: IUser[];
// }

// const initialState: MessageState = {
//   inbox: [],
//   loading: false,
//   activeChat: {
//     id: '',
//     messages: [],
//     participants: [],
//   },
//   foundUsersForNewChat: [],
// };
/**
 * Fetch a specific conversation and all messages related to it.
 */
export const findMessagesByConversationThunk = createAsyncThunk(
  'messages/findMessagesByConversation',
  async (conversationId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    let conversation = await messageAPI.findConversation(
      userId,
      conversationId
    );
    let messages = await messageAPI.findMessagesByConversation(
      userId,
      conversationId
    );
    conversation = dataOrStateError(conversation, ThunkAPI);
    messages = dataOrStateError(messages, ThunkAPI);
    return { conversation, messages };
  }
);
/**
 * Manages the state dealing with messages, including inbox and current active chat.
 */

const chatAdapter = createEntityAdapter<IMessage>({
  selectId: (message: IMessage) => message.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
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
    // Sets the state of the current active chat/conversation.
    // setActiveChat: (state, action) => {
    //   const conversation = action.payload;
    //   state.activeChat.id = conversation.id;
    //   state.activeChat.participants = conversation.participants;
    // },
    // updateChat: (state, action: PayloadAction<IMessage>) => {
    //   const conversation = action.payload.conversationId;
    //   if (
    //     conversation === state.activeChat.id && // same convo
    //     !state.activeChat.messages.includes(action.payload) // message not in chat
    //   ) {
    //     state.activeChat.messages.push(action.payload);
    //   }
    // },
    // clearFoundUsers: (state) => {
    //   state.foundUsersForNewChat = [];
    // },
  },
  // Manages the async call states for creating conversations.
  extraReducers: (builder) => {
    // builder.addCase(createConversationThunk.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(createConversationThunk.fulfilled, (state) => {
    //   state.loading = false;
    // });
    // builder.addCase(createConversationThunk.rejected, (state) => {
    //   state.loading = false;
    // });

    // builder.addCase(findInboxMessagesThunk.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(findInboxMessagesThunk.fulfilled, (state) => {
    //   state.loading = false;
    // });
    // builder.addCase(findInboxMessagesThunk.rejected, (state) => {
    //   state.loading = false;
    // });

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

    // builder.addCase(sendMessageThunk.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(sendMessageThunk.fulfilled, (state) => {
    //   state.loading = false;
    // });
    // builder.addCase(sendMessageThunk.rejected, (state) => {
    //   state.loading = false;
    // });

    // builder.addCase(findUsersByNameThunk.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(
    //   findUsersByNameThunk.fulfilled,
    //   (state, action: PayloadAction<IUser[]>) => {
    //     state.loading = false;
    //     state.foundUsersForNewChat = action.payload;
    //   }
    // );
    // builder.addCase(findUsersByNameThunk.rejected, (state) => {
    //   state.loading = false;
    // });
  },
});
export const selectActiveChat = createSelector(
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

export default chatSlice.reducer;
