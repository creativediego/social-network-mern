import React, { useCallback } from 'react';
import { ResponseError } from '../interfaces/IError';
import {
  clearAll,
  clearAllErrors,
  clearSuccess,
  selectGlobalError,
  selectPageError,
  selectSuccessAlert,
  setResponseError,
} from '../redux/alertSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const useAlert = () => {
  const error = useAppSelector(selectGlobalError);
  const pageError = useAppSelector(selectPageError);
  const success = useAppSelector(selectSuccessAlert);
  const dispatch = useAppDispatch();
  const setError = useCallback(
    (error: ResponseError) => {
      dispatch(setResponseError(error));
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
