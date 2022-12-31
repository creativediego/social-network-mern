import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { ResponseError } from '../interfaces/IError';
import { isError } from '../services/helpers';
import { setResponseError } from './alertSlice';
import { clearChat } from './chatSlice';
import { clearProfile } from './profileSlice';
import { clearUser } from './userSlice';

/**
 * Redux helper that checks if data returned from service contains an error. If so, updates the global error in errorSlice; otherwise, returns the passed-in data.
 */
export const dataOrStateError = <T>(
  APIdata: T | ResponseError,
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>,
  errorMessage?: string
): T => {
  if (isError(APIdata)) {
    if (APIdata.error.code === 403 || APIdata.error.code === 401) {
      dispatchAction(clearUser());
    } else {
      const userFriendlyError = {
        error: {
          message:
            'Error: ' +
            (errorMessage ? errorMessage : 'Sorry! Something went wrong.'),
        },
      };
      dispatchAction(setResponseError(userFriendlyError)); //update errors
    }
    throw Error('Thunk error: ' + APIdata.error.message);
  } else {
    return APIdata;
  }
};

export const clearAllUserData = (
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  dispatchAction(clearChat());
  dispatchAction(clearUser());
  dispatchAction(clearProfile());
};
