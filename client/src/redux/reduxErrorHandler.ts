import { AnyAction, ThunkAction, ThunkDispatch } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from './store';
import { FriendlyError } from '../interfaces/IError';
import { setGlobalError } from './alertSlice';

export const dispatchGlobalError = (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  error: unknown
): void => {
  if (error instanceof FriendlyError) {
    // Handle specific FriendlyError in alertSlice for global error
    dispatch(setGlobalError({ message: error.message, code: error.code }));
  } else {
    // Handle other error types or generic errors
    dispatch(
      setGlobalError({ message: 'Sorry, something went wrong!', code: 500 })
    );
  }
};

type ThunkFunction = (
  ...args: any[]
) => ThunkAction<Promise<any>, RootState, unknown, AnyAction>;

export const withErrorHandling = <T extends ThunkFunction>(asyncThunk: T) => {
  return (...args: Parameters<T>) =>
    async (dispatch: AppDispatch) => {
      const action = await dispatch(asyncThunk(...args));
      // For thunks that return an error
      if (action.error) {
        dispatchGlobalError(dispatch, new FriendlyError(action.error.message));
        // For thunks that dispatch other thunks, we need to check if the inner thunk has an error
      } else if (action.payload && action.payload.error) {
        dispatchGlobalError(
          dispatch,
          new FriendlyError(action.payload.error.message)
        );
      }
    };
};
