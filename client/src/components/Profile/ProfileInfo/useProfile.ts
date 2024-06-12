import { useEffect } from 'react';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  clearProfile,
  findProfileThunk,
  selectProfile,
  selectProfileLoading,
} from '../../../redux/profileSlice';
import { IUser } from '../../../interfaces/IUser';

/**
 * `useProfile` is a custom hook that fetches and provides the profile of a user.
 * It uses the `useAppDispatch` and `useAppSelector` hooks from Redux to dispatch actions and select state from the Redux store, the `useAuthUser` hook to get the authenticated user, and the `useEffect` hook from React to fetch the profile when the `username` changes.
 * When the component using the `useProfile` hook unmounts, it clears the profile data.
 *
 * @param {string} username - The username of the user whose profile is to be fetched.
 *
 * @returns {{ profileUser: IUser, isAuthUser: boolean, loading: boolean }} An object containing the profile user, a boolean indicating whether the profile user is the authenticated user, and a boolean indicating whether the profile is loading.
 *
 * @example
 * const { profileUser, isAuthUser, loading } = useProfile(username);
 *
 * @see {@link useAppDispatch} and {@link useAppSelector} for the hooks that dispatch actions and select state from the Redux store.
 * @see {@link useAuthUser} for the hook that provides the authenticated user.
 * @see {@link useEffect} for the hook that fetches the profile when the `username` changes.
 * @see {@link findProfileThunk} for the thunk that fetches the profile.
 * @see {@link clearProfile} for the action that clears the profile data.
 */
export const useProfile = (username: string) => {
  const dispatch = useAppDispatch();
  const loading: boolean = useAppSelector(selectProfileLoading);
  const profileUser: IUser = useAppSelector(selectProfile);
  const { user: authUser } = useAuthUser();

  useEffect(() => {
    if (!username) return;
    dispatch(findProfileThunk(username));
    // Clear the profile data when the component unmounts
    return () => {
      dispatch(clearProfile());
    };
  }, [dispatch, username]);

  return {
    profileUser,
    isAuthUser: authUser?.username === username,
    loading,
  };
};
