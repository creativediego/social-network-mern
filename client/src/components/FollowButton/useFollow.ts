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
