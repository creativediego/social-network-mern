/**
 * This module defines the notification slice of the Redux store for managing notifications in the application.
 *
 * The notification slice of the store uses the `createEntityAdapter` function from Redux Toolkit to generate a set of reducer functions and selectors.
 *
 * The `INotification` interface defines the shape of the notification data.
 *
 * The `notificationService` is used to interact with the notification API.
 *
 * The `findNotificationsThunk` async thunk fetches the notifications for the current user and updates the state.
 *
 * The `getNotificationCountThunk` async thunk fetches the count of notifications for the current user and updates the state.
 *
 * @module notificationSlice
 * @see {@link createEntityAdapter} for the function that generates a set of reducer functions and selectors.
 * @see {@link createSlice} for the function that generates the slice.
 * @see {@link PayloadAction} for the type of all dispatched actions.
 * @see {@link createSelector} for the function that creates memoized selectors.
 * @see {@link INotification} for the type of the notification data.
 * @see {@link notificationService} for the service that interacts with the notification API.
 * @see {@link RootState} for the type of the root state.
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
