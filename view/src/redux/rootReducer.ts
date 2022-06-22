import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import tuitReducer from './tuitSlice';
import errorReducer from './errorSlice';
import messageReducer from './messageSlice';
import notificationsReducer from './notificationSlice';

export const rootReducer = combineReducers({
  user: userReducer,
  tuits: tuitReducer,
  error: errorReducer,
  messages: messageReducer,
  notifications: notificationsReducer,
});
