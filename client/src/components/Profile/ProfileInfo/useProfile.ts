import { useState, useEffect } from 'react';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  findProfileThunk,
  selectProfile,
  selectProfileLoading,
  selectProfileIsFollowed,
  followThunk,
  unfollowThunk,
} from '../../../redux/profileSlice';

export const useProfile = (username: string) => {
  const dispatch = useAppDispatch();
  const profileUser = useAppSelector(selectProfile);
  const { user: authUser } = useAuthUser();
  const [isAuthUser, setIsAuthUser] = useState(false);
  const loading = useAppSelector(selectProfileLoading);
  const isFollowed = useAppSelector(selectProfileIsFollowed);

  useEffect(() => {
    if (!username) return;
    dispatch(findProfileThunk(username));
    setIsAuthUser(authUser.id === profileUser?.id);
  }, [dispatch, profileUser?.id, username, authUser.id]);

  const followUser = () => {
    if (profileUser.id === authUser.id) {
      return;
    }
    dispatch(
      followThunk({ authUserId: authUser.id, followeeId: profileUser.id })
    );
  };

  const unfollowUser = () => {
    if (profileUser.id === authUser.id) {
      return;
    }
    dispatch(
      unfollowThunk({ authUserId: authUser.id, followeeId: profileUser.id })
    );
  };

  return {
    profileUser,
    isAuthUser,
    isFollowed,
    loading,
    followUser,
    unfollowUser,
  };
};
