import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  loginThunk,
  selectAuthUser,
  selectAuthUserLoading,
  selectIsLoggedIn,
  selectIsProfileComplete,
} from '../redux/userSlice';
import { logoutThunk } from '../redux/userSlice';

export const useAuthUser = () => {
  const user = useAppSelector(selectAuthUser);
  const profileComplete = useAppSelector(selectIsProfileComplete);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const loading = useAppSelector(selectAuthUserLoading);
  const dispatch = useAppDispatch();

  const login = useCallback(
    async (email: string, password: string) => {
      if (!email || !password) {
        return;
      }
      dispatch(loginThunk({ email, password }));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    dispatch(logoutThunk());
  }, [dispatch]);

  return {
    user,
    profileComplete,
    isLoggedIn,
    logout,
    login,
    loading,
  };
};
