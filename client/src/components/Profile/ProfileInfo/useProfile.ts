import { useState, useEffect } from 'react';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  findProfileThunk,
  selectProfile,
  selectProfileLoading,
} from '../../../redux/profileSlice';

export const useProfile = (username: string) => {
  const dispatch = useAppDispatch();
  const profileUser = useAppSelector(selectProfile);
  const { user: authUser } = useAuthUser();
  const [isAuthUser, setIsAuthUser] = useState(false);
  const loading = useAppSelector(selectProfileLoading);

  useEffect(() => {
    dispatch(findProfileThunk(username));
    setIsAuthUser(authUser.id === profileUser?.id);
  }, [dispatch, profileUser?.id, username, authUser.id]);

  return {
    profileUser,
    isAuthUser,
    loading,
  };
};
