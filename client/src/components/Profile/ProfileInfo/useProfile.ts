import { useState, useEffect } from 'react';
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
 * Custom hook to fetch and manage user profile information.
 *
 * @param {string} username - The username of the profile to fetch.
 *
 * @returns {{
 *   profileUser: IUser,  // The user's profile data or null if not loaded.
 *   isAuthUser: boolean,        // True if the user is the authenticated user, false otherwise.
 *   loading: boolean            // True if the profile data is being fetched, false otherwise.
 * }}
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
