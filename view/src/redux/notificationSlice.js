/**
 * Includes redux state management for user actions such as login and update user.
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { dataOrStateError } from './helpers';
import {
  findNotifications,
  findUnreadNotifications,
  markNotificationAsRead,
} from '../services/notifications-service';

export const findNotificationsThunk = createAsyncThunk(
  'notifications/findNotifications',
  async (data, ThunkAPI) => {
    const userId = ThunkAPI.getState().user.data.id;
    const notifications = await findNotifications(userId);
    return dataOrStateError(notifications, ThunkAPI);
  }
);

export const findUnreadNotificationsThunk = createAsyncThunk(
  'notifications/findUnreadNotifications',
  async (data, ThunkAPI) => {
    const userId = ThunkAPI.getState().user.data.id;
    const notifications = await findUnreadNotifications(userId);
    return dataOrStateError(notifications, ThunkAPI);
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  'notifications/markNotificationRead',
  async (notificationId, ThunkAPI) => {
    const notification = await markNotificationAsRead(notificationId);
    return dataOrStateError(notification, ThunkAPI);
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    loading: false,
    all: [],
    unread: [],
  },
  reducers: {
    updateNotifications: (state, action) => {
      const notification = action.payload;
      if (state.all.some((e) => e.id === notification.id)) {
        return;
      }
      state.all.unshift(notification);
      if (!notification.read) state.unread.unshift(notification);
    },
    setUnreadNotifications: (state, action) => {
      state.unread = action.payload;
    },
    clearUnreadNotifications: (state) => {
      state.unread = [];
    },
  },
  extraReducers: {
    [findNotificationsThunk.pending]: (state) => {
      state.loading = true;
    },
    [findNotificationsThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.all = action.payload;
    },
    [findNotificationsThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    [findUnreadNotificationsThunk.pending]: (state) => {
      state.loading = true;
    },
    [findUnreadNotificationsThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.unread = action.payload;
    },
    [findUnreadNotificationsThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    [markNotificationReadThunk.pending]: (state) => {
      state.loading = true;
    },
    [markNotificationReadThunk.fulfilled]: (state, action) => {
      state.loading = false;
      const readNotification = action.payload;
      state.unread = state.unread.filter(
        (notification) => notification.id !== readNotification.id
      );
      state.all = state.all.map((notification) => {
        if (notification.id === readNotification.id) return readNotification;
        else return notification;
      });
    },
    [markNotificationReadThunk.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
export const {
  setNotifications,
  setUnreadNotifications,
  clearUnreadNotifications,
  updateNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
