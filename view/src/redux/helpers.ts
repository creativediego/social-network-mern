import { BaseThunkAPI } from '@reduxjs/toolkit/dist/createAsyncThunk';
import { IError, ResponseError } from '../interfaces/IError';
import { isError } from '../services/helpers';
import { setGlobalError, setResponseError } from './errorSlice';
// @ts-ignore
import { clearUser } from './userSlice';

/**
 * Redux helper that checks if data returned from service contains an error. If so, updates the global error in errorSlice; otherwise, returns the passed-in data.
 */
export const dataOrStateError = <T>(
  APIdata: T | ResponseError,
  ThunkAPI: any
): T => {
  if (isError(APIdata)) {
    if (APIdata.error.code === 403 || APIdata.error.code === 401) {
      ThunkAPI.dispatch(clearUser());
    } else {
      ThunkAPI.dispatch(setResponseError(APIdata)); //update errors
    }
    throw Error('Thunk error: ' + APIdata.error.message);
  } else {
    return APIdata;
  }
};
