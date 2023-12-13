import { useCallback, useEffect } from 'react';
import { IGlobalError } from '../interfaces/IError';
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

export const useAlert = () => {
  const error = useAppSelector(selectGlobalError);
  const pageError = useAppSelector(selectPageError);
  const success = useAppSelector(selectSuccessAlert);
  const dispatch = useAppDispatch();
  const setError = useCallback(
    (error: IGlobalError) => {
      dispatch(setGlobalError(error));
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
