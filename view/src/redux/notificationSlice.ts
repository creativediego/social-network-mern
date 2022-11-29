/**
 * Includes redux state management for user actions such as login and update user.
 */
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { dataOrStateError } from './helpers';
import {
  findNotifications,
  findUnreadNotifications,
  markNotificationAsRead,
} from '../services/notifications-service';
import { INotification } from '../interfaces/INotification';
import { RootState } from './store';

export const findNotificationsThunk = createAsyncThunk(
  'notifications/findNotifications',
  async (data, ThunkAPI: any) => {
    const userId = ThunkAPI.getState().user.data.id;
    const notifications = await findNotifications(userId);
    return dataOrStateError(notifications, ThunkAPI);
  }
);

export const findUnreadNotificationsThunk = createAsyncThunk(
  'notifications/findUnreadNotifications',
  async (data, ThunkAPI: any) => {
    const userId = ThunkAPI.getState().user.data.id;
    const notifications = await findUnreadNotifications(userId);
    return dataOrStateError(notifications, ThunkAPI);
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  'notifications/markNotificationRead',
  async (notificationId: string, ThunkAPI: any) => {
    const notification = await markNotificationAsRead(notificationId);
    return dataOrStateError(notification, ThunkAPI);
  }
);

export interface NotificationsState {
  all: INotification[];
  unread: INotification[];
  loading: boolean;
}

const initialState: NotificationsState = {
  all: [],
  unread: [],
  loading: false,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
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
  extraReducers: (builder) => {
    builder.addCase(findNotificationsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findNotificationsThunk.fulfilled,
      (state, action: PayloadAction<INotification[]>) => {
        state.loading = false;
        state.all = action.payload;
      }
    );
    builder.addCase(findNotificationsThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(findUnreadNotificationsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findUnreadNotificationsThunk.fulfilled,
      (state, action: PayloadAction<INotification[]>) => {
        state.loading = false;
        state.all = action.payload;
      }
    );
    builder.addCase(findUnreadNotificationsThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(markNotificationReadThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      markNotificationReadThunk.fulfilled,
      (state, action: PayloadAction<INotification>) => {
        state.loading = false;
        const readNotification = action.payload;
        state.unread = state.unread.filter(
          (notification) => notification.id !== readNotification.id
        );
        state.all = state.all.map((notification) => {
          if (notification.id === readNotification.id) return readNotification;
          else return notification;
        });
      }
    );
    builder.addCase(markNotificationReadThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const selectAllNotifications = createSelector(
  (state: RootState) => state.notifications.all,
  (notifications) => notifications
);

export const selectNotificationsLoading = createSelector(
  (state: RootState) => state.notifications.loading,
  (loading) => loading
);

export const {
  setUnreadNotifications,
  clearUnreadNotifications,
  updateNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
