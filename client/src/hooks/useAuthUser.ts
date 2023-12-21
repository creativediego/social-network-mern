import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  loginThunk,
  selectAuthUser,
  selectAuthUserLoading,
  selectIsLoggedIn,
  selectIsProfileComplete,
} from '../redux/userSlice';
import { logoutThunk } from '../redux/userSlice';
import { setGlobalError } from '../redux/alertSlice';

export const useAuthUser = () => {
  const user = useAppSelector(selectAuthUser);
  const profileComplete = useAppSelector(selectIsProfileComplete);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const loading = useAppSelector(selectAuthUserLoading);
  const dispatch = useAppDispatch();

  const [loginUser, setLoginUser] = useState<{
    email: string;
    password: string;
  }>({ email: '', password: '' });

  const handleSetLoginUser = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const element: HTMLInputElement = e.currentTarget;
      setLoginUser({ ...loginUser, [element.name]: element.value });
    },
    [loginUser]
  );

  const login = useCallback(async () => {
    const { email, password } = loginUser;
    if (!email || !password) {
      dispatch(setGlobalError({ message: 'Email and password required.' }));
      return;
    }
    await dispatch(loginThunk({ email, password }));
  }, [dispatch, loginUser]);

  const logout = useCallback(async () => {
    dispatch(logoutThunk());
  }, [dispatch]);

  return {
    user,
    profileComplete,
    isLoggedIn,
    logout,
    login,
    handleSetLoginUser,
    loading,
    loginUser,
  };
};
