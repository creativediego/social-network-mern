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

import { notificationService } from '../services/notificationService';

import { INotification } from '../interfaces/INotification';
import type { RootState } from './store';

export const findNotificationsThunk = createAsyncThunk(
  'notifications/findNotifications',
  async (data, ThunkAPI: any) => {
    const userId = ThunkAPI.getState().user.data.id;
    const notifications = await notificationService.findNotifications();
    return notifications;
  }
);

export const getNotificationCountThunk = createAsyncThunk(
  'notifications/findNotificationCount',
  async (_, ThunkAPI: any) => {
    const userId = ThunkAPI.getState().user.data.id;
    const count = await notificationService.getNotificationCount();
    return count;
  }
);

export const markNotificationReadThunk = createAsyncThunk(
  'notifications/markNotificationRead',
  async (notificationId: string, ThunkAPI: any) => {
    const notification = await notificationService.markNotificationAsRead(
      notificationId
    );
    return notificationId;
  }
);

export interface NotificationsState {
  all: INotification[];
  loading: boolean;
  notificationCount: number;
}

const notificationAdapter = createEntityAdapter<INotification>({
  selectId: (notification: INotification) => notification.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: notificationAdapter.getInitialState({
    loading: false,
    notificationCount: 0,
  }),
  reducers: {
    addNotification: (state, action: PayloadAction<INotification>) => {
      notificationAdapter.addOne(state, action.payload);
      state.notificationCount += 1;
    },
    deleteNotification: (state, action: PayloadAction<INotification>) => {
      notificationAdapter.removeOne(state, action.payload.id);
      state.notificationCount -= 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotificationCountThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getNotificationCountThunk.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.notificationCount = action.payload;
      }
    );
    builder.addCase(getNotificationCountThunk.rejected, (state) => {
      state.loading = false;
    });

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
    builder.addCase(markNotificationReadThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      markNotificationReadThunk.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        notificationAdapter.removeOne(state, action.payload);
        state.notificationCount -= 1;
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

export const selectNotificationCount = createSelector(
  (state: RootState) => state.notifications.notificationCount,
  (count) => count
);

export const { addNotification, deleteNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
