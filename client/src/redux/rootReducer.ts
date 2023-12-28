import { combineReducers } from '@reduxjs/toolkit';
import alertReducer from './alertSlice';
import userReducer from './userSlice';
import profileReducer from './profileSlice';
import postsReducer from './postSlice';
import messageReducer from './chatSlice';
import notificationsReducer from './notificationSlice';
import messagesInboxReducer from './messageInboxSlice';
import chatReducer from './chatSlice';
import modalReducer from './modalSlice';

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
});
