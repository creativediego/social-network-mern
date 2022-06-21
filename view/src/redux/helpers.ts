import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { setGlobalError } from './errorSlice';
// @ts-ignore
import { clearUser } from './userSlice';

/**
 * Redux helper that checks if data returned from service contains an error. If so, updates the global error in errorSlice; otherwise, returns the passed-in data.
 */
export const dataOrStateError = (APIdata: any, ThunkAPI: any) => {
  if (APIdata.error || APIdata instanceof Error) {
    if (APIdata.code === 403 || APIdata.code === 401) {
      ThunkAPI.dispatch(clearUser());
    }
    ThunkAPI.dispatch(setGlobalError(APIdata.error)); //update errors
    throw Error('Thunk error: ' + APIdata.error || APIdata.message);
  }

  return APIdata;
};
