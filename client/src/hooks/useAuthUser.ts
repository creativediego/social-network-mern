import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  loginThunk,
  loginWithGoogleThunk,
  registerWithGoogleThunk,
  selectAuthUser,
  selectAuthUserLoading,
  selectCompletedSignup,
  selectIsLoggedIn,
  selectIsVerified,
} from '../redux/userSlice';
import { logoutThunk } from '../redux/userSlice';
import { useAlert } from './useAlert';

export const useAuthUser = () => {
  const user = useAppSelector(selectAuthUser);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isVerified = useAppSelector(selectIsVerified);
  const completedSignup = useAppSelector(selectCompletedSignup);
  const loading = useAppSelector(selectAuthUserLoading);
  const { setError } = useAlert();
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
      setError('Email and password required.');
      return;
    }
    await dispatch(loginThunk({ email, password }));
  }, [dispatch, setError, loginUser]);

  const loginWithGoogle = useCallback(() => {
    dispatch(loginWithGoogleThunk());
  }, [dispatch]);

  const registerWithGoogle = useCallback(() => {
    dispatch(registerWithGoogleThunk());
  }, [dispatch]);

  const logout = useCallback(async () => {
    dispatch(logoutThunk());
  }, [dispatch]);

  return {
    user,
    isLoggedIn,
    isVerified,
    completedSignup,
    logout,
    login,
    loginWithGoogle,
    registerWithGoogle,
    handleSetLoginUser,
    loading,
    loginUser,
  };
};
