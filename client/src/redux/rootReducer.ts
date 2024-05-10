import { combineReducers } from '@reduxjs/toolkit';
import alertReducer from './alertSlice';
import userReducer from './userSlice';
import profileReducer from './profileSlice';
import postsReducer from './postSlice';
import messageReducer from './chatSlice';
import notificationsReducer from './notificationSlice';
import messagesInboxReducer from './inboxSlice';
import chatReducer from './chatSlice';
import modalReducer from './modalSlice';
// import { postApi } from './postApi';

export const rootReducer = combineReducers({
  alert: alertReducer,
  user: userReducer,
  profile: profileReducer,
  posts: postsReducer,
  messages: messageReducer,
  notifications: notificationsReducer,
  messagesInbox: messagesInboxReducer,
  chat: chatReducer,
  modal: modalReducer,
  // [postApi.reducerPath]: postApi.reducer,
});
