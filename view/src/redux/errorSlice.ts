import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IError } from '../interfaces/IError';
import { RootState } from './store';

/**
 * Handles global error state for the app. Used to display error messages in higher level parent components.
 */

export interface ErrorState extends IError {}
const initialState: ErrorState = {
  message: '',
  code: undefined,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setGlobalError: (state, action: PayloadAction<IError>) => {
      state.message = action.payload.message;
      state.code = action.payload.code;
    },
    clearGlobalError: (state) => {
      state.message = '';
    },
  },
});
export const errorSelector = createSelector(
  (state: RootState) => state.error,
  (error) => error
);
export const { setGlobalError, clearGlobalError } = errorSlice.actions;
export default errorSlice.reducer;
