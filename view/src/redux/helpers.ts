import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { ResponseError } from '../interfaces/IError';
import { isError } from '../services/helpers';
import { setResponseError } from './alertSlice';
import { clearChat } from './chatSlice';
import { clearUser } from './userSlice';

/**
 * Redux helper that checks if data returned from service contains an error. If so, updates the global error in errorSlice; otherwise, returns the passed-in data.
 */
export const dataOrStateError = <T>(
  APIdata: T | ResponseError,
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
): T => {
  if (isError(APIdata)) {
    if (APIdata.error.code === 403 || APIdata.error.code === 401) {
      dispatchAction(clearUser());
    } else {
      const userFriendlyError = {
        error: {
          message: 'Ooops! Something went wrong. Try again later.',
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
};
