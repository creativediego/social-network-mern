import { useAuthUser } from '../../hooks/useAuthUser';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  followThunk,
  selectProfileIsFollowed,
  selectProfileLoading,
  unfollowThunk,
} from '../../redux/profileSlice';

export const useFollow = (userId: string) => {
  console.log('useProfile rendered');
  const dispatch = useAppDispatch();
  const { user: authUser } = useAuthUser();
  const loading = useAppSelector(selectProfileLoading);
  const isFollowed = useAppSelector(selectProfileIsFollowed);

  const followUser = () => {
    if (userId === authUser.id) {
      return;
    }
    dispatch(followThunk({ authUserId: authUser.id, followeeId: userId }));
  };

  const unfollowUser = () => {
    if (userId === authUser.id) {
      return;
    }
    dispatch(unfollowThunk({ authUserId: authUser.id, followeeId: userId }));
  };

  return {
    isFollowed,
    followUser,
    unfollowUser,
    loading,
  };
};
