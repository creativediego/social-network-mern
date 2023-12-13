/**
 * Includes redux state management for user actions such as login and update user.
 */
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { dataOrThrowError } from './helpers';
import {
  findNotifications,
  findUnreadNotifications,
  markNotificationAsRead,
} from '../services/notifications-service';
import { INotification } from '../interfaces/INotification';
import type { RootState } from './store';

export const findNotificationsThunk = createAsyncThunk(
  'notifications/findNotifications',
  async (data, ThunkAPI: any) => {
    const userId = ThunkAPI.getState().user.data.id;
    const notifications = await findNotifications(userId);
    return dataOrThrowError(notifications, ThunkAPI);
  }
);

export const findUnreadNotificationsThunk = createAsyncThunk(
  'notifications/findUnreadNotifications',
  async (data, ThunkAPI: any) => {
    const userId = ThunkAPI.getState().user.data.id;
    const notifications = await findUnreadNotifications(userId);
    return dataOrThrowError(notifications, ThunkAPI);
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  'notifications/markNotificationRead',
  async (notificationId: string, ThunkAPI: any) => {
    const notification = await markNotificationAsRead(notificationId);
    return dataOrThrowError(notification, ThunkAPI);
  }
);

export interface NotificationsState {
  all: INotification[];
  loading: boolean;
}

const notificationAdapter = createEntityAdapter<INotification>({
  selectId: (notification: INotification) => notification.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: notificationAdapter.getInitialState({ loading: false }),
  reducers: {
    upsertNotification: (state, action: PayloadAction<INotification>) => {
      notificationAdapter.addOne(state, action.payload);
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
        notificationAdapter.setAll(state, action.payload);
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
        notificationAdapter.setAll(state, action.payload);
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
        notificationAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(markNotificationReadThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const selectAllNotifications = createSelector(
  (state: RootState) =>
    notificationAdapter.getSelectors().selectAll(state.notifications),
  (notifications) => notifications
);

export const selectUnreadNotifications = createSelector(
  (state: RootState) =>
    notificationAdapter.getSelectors().selectAll(state.notifications),
  (notifications) => notifications.filter((notification) => !notification.read)
);

export const selectNotificationsLoading = createSelector(
  (state: RootState) => state.notifications.loading,
  (loading) => loading
);

export const { upsertNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
