import { useCallback, useState, FormEvent } from 'react';
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

/**
 * `useAuthUser` is a custom hook that provides the authenticated user and related state and functions.
 * It uses several selectors from the `userSlice` to get the current user state from the Redux store.
 * It also uses the `useAppDispatch` hook to get the dispatch function from the Redux store.
 * The `setError` function from the `useAlert` hook is used to set global error messages.
 * The `loginUser` state is used to manage the login form fields.
 *
 * @returns {Object} The state and functions related to the authenticated user.
 * @property {IUser | null} user - The authenticated user.
 * @property {boolean} isLoggedIn - Whether the user is logged in.
 * @property {boolean} isVerified - Whether the user is verified.
 * @property {boolean} completedSignup - Whether the user has completed signup.
 * @property {boolean} loading - Whether the user state is loading.
 * @property {Object} loginUser - The login form fields.
 * @property {(user: { email: string; password: string }) => void} setLoginUser - The function to set the login form fields.
 *
 * @example
 * const { user, isLoggedIn, isVerified, completedSignup, loading, loginUser, setLoginUser } = useAuthUser();
 *
 * @see {@link useAppSelector} for the hook that selects state from the Redux store.
 * @see {@link useAppDispatch} for the hook that dispatches actions to the Redux store.
 * @see {@link useState} for the hook that manages the login form fields.
 * @see {@link useAlert} for the hook that provides the `setError` function.
 */
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
    (e: FormEvent<HTMLInputElement>) => {
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
