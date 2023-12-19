import { useState, useEffect } from 'react';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  findProfileThunk,
  selectProfile,
  selectProfileLoading,
} from '../../../redux/profileSlice';

export const useProfile = (username: string) => {
  console.log('useProfile rendered');
  const dispatch = useAppDispatch();
  const profileUser = useAppSelector(selectProfile);
  const { user: authUser } = useAuthUser();
  const [isAuthUser, setIsAuthUser] = useState(false);
  const loading = useAppSelector(selectProfileLoading);

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
