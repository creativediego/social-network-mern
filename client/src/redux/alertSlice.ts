import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAlert, IGlobalError } from '../interfaces/IError';
import type { RootState } from './store';

/**
 * Handles global error state for the app. Used to display error messages in higher level parent components.
 */

// export interface AlertState extends IAlert {}

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
    setGlobalError: (state, action: PayloadAction<IGlobalError>) => {
      state.error = action.payload;
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
