import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { FriendlyError, IGlobalError } from '../interfaces/IError';
import { isError } from '../services/api-helpers';
import { setGlobalError } from './alertSlice';
import { clearChat } from './chatSlice';
import { clearProfile } from './profileSlice';
import { clearUser } from './userSlice';

/**
 * Redux helper that checks if data returned from service contains an error. If so, updates the global error in errorSlice; otherwise, returns the passed-in data.
 */
export const dataOrThrowError = <T>(
  APIdata: T | IGlobalError,
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
): T => {
  if (!isError(APIdata)) {
    console.log('not error', APIdata);
    return APIdata;
  }

  if (APIdata.error.code === 403 || APIdata.error.code === 401) {
    dispatchAction(clearUser());
  } else {
    dispatchAction(setGlobalError({ error: APIdata.error })); //update errors
  }
  throw new FriendlyError(APIdata.error.message);
};

export const clearAllUserData = (
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  dispatchAction(clearChat());
  dispatchAction(clearUser());
  dispatchAction(clearProfile());
};

// export const dispatchGlobalError = (
//   dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
//   error: unknown
// ): void => {
//   if (error instanceof FriendlyError) {
//     // Handle specific FriendlyError in alertSlice for global error
//     dispatch(setGlobalError(error));
//   } else {
//     // Handle other error types or generic errors
//     dispatch(setGlobalError(new FriendlyError('Sorry! Something went wrong.')));
//   }
// };
