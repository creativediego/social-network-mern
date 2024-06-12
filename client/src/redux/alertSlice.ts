/**
 * This module defines the alert slice of the Redux store for managing global and page-specific alerts in the application.
 *
 * The alert slice of the store has three properties: `error`, `success`, and `pageError`.
 *
 * - `error`: This property is used to store the global error state of the app. It is an object of type `IAlert` that contains a `message` property. This message is displayed as a global error alert to the user.
 *
 * - `success`: This property is used to store the global success state of the app. It is also an object of type `IAlert` that contains a `message` property. This message is displayed as a global success alert to the user.
 *
 * - `pageError`: This property is used to store the page-specific error state of the app. It is an object of type `IAlert` that contains a `message` property. This message is displayed as an error alert specific to the current page.
 *
 * The initial state of the alert slice is an object with `error`, `success`, and `pageError` properties, each with an empty `message`.
 *
 * @module alertSlice
 * @see {@link createSelector} for the function that creates memoized selectors.
 * @see {@link createSlice} for the function that generates the slice.
 * @see {@link PayloadAction} for the type of all dispatched actions.
 * @see {@link IAlert} for the type of the alert state.
 * @see {@link RootState} for the type of the root state.
 */
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAlert } from '../interfaces/IError';
import type { RootState } from './store';

interface AlertState {
  error: IAlert;
  success: IAlert;
  pageError: IAlert;
}
const initialState: AlertState = {
  error: {
    message: '',
  },
  success: {
    message: '',
  },
  pageError: {
    message: '',
  },
};

const alertSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setGlobalError: (state, action: PayloadAction<IAlert>) => {
      state.error = action.payload;
      state.error.code = action.payload.code;
    },
    setPageError: (state, action: PayloadAction<IAlert>) => {
      state.pageError = action.payload;
    },
    setSuccessAlert: (state, action: PayloadAction<IAlert>) => {
      state.success.message = action.payload.message;
      state.success.code = action.payload.code;
    },
    clearAllErrors: (state) => {
      state.error.message = '';
      state.error.code = '';
    },
    clearSuccess: (state) => {
      state.success.message = '';
      state.success.code = '';
    },
    clearAll: (state) => {
      state.error.message = '';
      state.error.code = '';
      state.success.message = '';
    },
  },
});
export const selectGlobalError = createSelector(
  (state: RootState) => state.alert.error,
  (error: IAlert) => error
);

export const selectSuccessAlert = createSelector(
  (state: RootState) => state.alert.success,
  (sucess: IAlert) => sucess
);

export const selectPageError = createSelector(
  (state: RootState) => state.alert.pageError,
  (error: IAlert) => error
);

export const selectGlobalErrorMessage = createSelector(
  (state: RootState) => state.alert.error,
  (error: IAlert) => error.message
);

export const {
  setGlobalError,
  clearAllErrors,
  setSuccessAlert,
  clearSuccess,
  clearAll,
  setPageError,
} = alertSlice.actions;
export default alertSlice.reducer;
