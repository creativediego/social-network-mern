import { useEffect } from 'react';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  followThunk,
  selectProfileIsFollowed,
  unfollowThunk,
  isFollowedThunk,
  selectFollowLoading,
} from '../../redux/profileSlice';

/**
 * `useFollow` is a custom hook that provides functionality to follow and unfollow a user,
 * and to check if a user is followed. It uses Redux for state management.
 *
 * @param {string} userId - The ID of the user to follow or unfollow.
 *
 * @returns {object} An object containing the following properties:
 * - `loading`: A boolean indicating whether the follow/unfollow operation is in progress.
 * - `isFollowed`: A boolean indicating whether the user is followed.
 * - `followUser`: A function that initiates the follow operation.
 * - `unfollowUser`: A function that initiates the unfollow operation.
 *
 * @example
 * const { loading, isFollowed, followUser, unfollowUser } = useFollow(userId);
 *
 * @see {@link useAuthUser} for the hook that provides the authenticated user.
 * @see {@link useAppDispatch} and {@link useAppSelector} for Redux hooks.
 * @see {@link followThunk}, {@link selectProfileIsFollowed}, {@link unfollowThunk},
 * {@link isFollowedThunk}, {@link selectFollowLoading} for Redux actions and selectors used.
 */

export const useFollow = (userId: string) => {
  const dispatch = useAppDispatch();
  const { user: authUser } = useAuthUser();
  const loading = useAppSelector(selectFollowLoading);
  const isFollowed = useAppSelector(selectProfileIsFollowed);

  const followUser = () => {
    if (userId === authUser.id) {
      return;
    }
    dispatch(followThunk(userId));
  };

  const unfollowUser = () => {
    if (userId === authUser.id) {
      return;
    }
    dispatch(unfollowThunk(userId));
  };

  const checkFollowed = (userId: string) => {
    dispatch(isFollowedThunk(userId));
  };

  useEffect(() => {
    if (authUser.id && userId) {
      checkFollowed(userId);
    }
  }, []);

  return {
    isFollowed,
    followUser,
    unfollowUser,
    loading,
  };
};
