import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IError, ResponseError } from '../interfaces/IError';
import { RootState } from './store';

/**
 * Handles global error state for the app. Used to display error messages in higher level parent components.
 */

export interface ErrorState extends IError {}
const initialState: IError = {
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
    setResponseError: (state, action: PayloadAction<ResponseError>) => {
      state.message = action.payload.error.message;
      state.code = action.payload.error.code;
    },
    clearAllErrors: (state) => {
      state.message = '';
      state.code = '';
    },
  },
});
export const selectGlobalError = createSelector(
  (state: RootState) => state.error,
  (error) => error
);

export const selectGlobalErrorMessage = createSelector(
  (state: RootState) => state.error,
  (error) => error.message
);

export const { setGlobalError, setResponseError, clearAllErrors } =
  errorSlice.actions;
export default errorSlice.reducer;
