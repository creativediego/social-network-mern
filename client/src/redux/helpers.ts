import { AnyAction, ThunkDispatch } from '@reduxjs/toolkit';
import { clearChat } from './chatSlice';
import { clearProfile } from './profileSlice';
import { clearUser } from './userSlice';

export const clearAllUserData = (
  dispatchAction: ThunkDispatch<unknown, unknown, AnyAction>
) => {
  dispatchAction(clearChat());
  dispatchAction(clearUser());
  dispatchAction(clearProfile());
};
