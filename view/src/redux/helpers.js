import { setGlobalError } from './errorSlice';
import { clearUser } from './userSlice';

/**
 * Redux helper that checks if data returned from service contains an error. If so, updates the global error in errorSlice; otherwise, returns the passed-in data.
 */
export const dataOrStateError = (APIdata, ThunkAPI) => {
  if (APIdata.error) {
    if (APIdata.status === 403) {
      ThunkAPI.dispatch(clearUser());
      clearToken();
      return ThunkAPI.dispatch(
        setGlobalError({ error: 'Session expired. Login in again.' })
      );
    } else {
      return ThunkAPI.dispatch(setGlobalError(APIdata)); //update errors
    }
  }
  ThunkAPI.dispatch(setGlobalError({ error: '' })); //clear errors
  return APIdata;
};

export const clearToken = () => {
  localStorage.removeItem('token');
};
