import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tuitReducer from './tuitSlice';
import alertReducer from './alertSlice';
import messageReducer from './chatSlice';
import notificationsReducer from './notificationSlice';
import messagesInboxReducer from './messageInboxSlice';
import chatReducer from './chatSlice';
import profileReducer from './profileSlice';

export const rootReducer = combineReducers({
  user: userReducer,
  tuits: tuitReducer,
  profile: profileReducer,
  alert: alertReducer,
  messages: messageReducer,
  notifications: notificationsReducer,
  messagesInbox: messagesInboxReducer,
  chat: chatReducer,
});
