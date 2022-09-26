import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tuitReducer from './tuitSlice';
import errorReducer from './errorSlice';
import messageReducer from './chatSlice';
import notificationsReducer from './notificationSlice';
import messagesInboxReducer from './messageInboxSlice';
import chatReducer from './chatSlice';

export const rootReducer = combineReducers({
  user: userReducer,
  tuits: tuitReducer,
  error: errorReducer,
  messages: messageReducer,
  notifications: notificationsReducer,
  messagesInbox: messagesInboxReducer,
  chat: chatReducer,
});
