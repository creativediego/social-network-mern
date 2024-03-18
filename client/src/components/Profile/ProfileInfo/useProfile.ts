import { useState, useEffect } from 'react';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
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
  const profileUser: IUser = useAppSelector(selectProfile);
  const { user: authUser } = useAuthUser();
  const [isAuthUser, setIsAuthUser] = useState<boolean>(false);
  const loading: boolean = useAppSelector(selectProfileLoading);

  useEffect(() => {
    if (!username) return;

    dispatch(findProfileThunk(username));
    setIsAuthUser(authUser.id === profileUser?.id);
  }, [dispatch, username, authUser.id, profileUser?.id]);

  return {
    profileUser,
    isAuthUser,
    loading,
  };
};
