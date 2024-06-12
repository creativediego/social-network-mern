import { useCallback, useEffect } from 'react';
import {
  clearAll,
  clearAllErrors,
  clearSuccess,
  selectGlobalError,
  selectPageError,
  selectSuccessAlert,
  setGlobalError,
} from '../redux/alertSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

/**
 * `useAlert` is a custom hook that provides functions to manage global alerts.
 * It uses several selectors from the `alertSlice` to get the current alert state from the Redux store.
 * It also uses the `useAppDispatch` hook to get the dispatch function from the Redux store.
 * The hook returns several values and functions that can be used to interact with the alert state.
 *
 * @returns {Object} The state and functions related to the global alerts.
 * @property {string | null} error - The global error message.
 * @property {string | null} pageError - The page error message.
 * @property {string | null} success - The success alert message.
 * @property {(message: string) => void} setError - The function to set the global error message.
 * @property {() => void} clearErrors - The function to clear all error messages.
 * @property {() => void} clearSuccessAlert - The function to clear the success alert message.
 * @property {() => void} clearAllAlerts - The function to clear all alerts.
 *
 * @example
 * const { error, pageError, success, setError, clearErrors, clearSuccessAlert, clearAllAlerts } = useAlert();
 *
 * @see {@link useAppSelector} for the hook that selects state from the Redux store.
 * @see {@link useAppDispatch} for the hook that dispatches actions to the Redux store.
 * @see {@link useCallback} for the hook that memoizes the functions.
 * @see {@link useEffect} for the hook that clears all alerts when the component unmounts.
 */
export const useAlert = () => {
  const error = useAppSelector(selectGlobalError);
  const pageError = useAppSelector(selectPageError);
  const success = useAppSelector(selectSuccessAlert);
  const dispatch = useAppDispatch();
  const setError = useCallback(
    (message: string) => {
      dispatch(setGlobalError({ message }));
    },
    [dispatch]
  );

  const clearErrors = useCallback(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  const clearSuccessAlert = useCallback(() => {
    dispatch(clearSuccess());
  }, [dispatch]);

  const clearAllAlerts = useCallback(() => {
    dispatch(clearAll());
  }, [dispatch]);

  useEffect(() => {
    if (error.message || success.message) {
      setTimeout(() => {
        dispatch(clearAll());
      }, 9000);
    }
  }, [error, success, dispatch]);

  return {
    error,
    success,
    pageError,
    setError,
    clearErrors,
    clearSuccessAlert,
    clearAllAlerts,
  };
};
