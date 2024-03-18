import {
  Middleware,
  MiddlewareAPI,
  Dispatch,
  AnyAction,
} from '@reduxjs/toolkit';
import { setGlobalError } from './alertSlice';
import { clearUser } from './userSlice';

const reduxErrorMiddleware: Middleware =
  (api: MiddlewareAPI) => (next: Dispatch) => (action: AnyAction) => {
    // Check if the action is from a thunk and has an error
    if (action.type.endsWith('/rejected') && action.error) {
      const errorMessage: string = action.error.message || '';
      if (errorMessage === '401') {
        api.dispatch(
          setGlobalError({
            message: 'Authorization Error: Please Log in again.',
            code: 401,
          })
        );
        api.dispatch(clearUser());
        return next(action);
      }

      // Handle other specific errors or general error handling
      api.dispatch(setGlobalError({ message: errorMessage, code: 500 }));
      return next(action);
    }

    return next(action);
  };

export default reduxErrorMiddleware;
