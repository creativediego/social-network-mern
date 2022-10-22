import React, { useCallback } from 'react';
import { ResponseError } from '../interfaces/IError';
import { selectGlobalError, setResponseError } from '../redux/errorSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

export const useError = () => {
  const error = useAppSelector(selectGlobalError);
  const dispatch = useAppDispatch();
  const setError = useCallback(
    (error: ResponseError) => {
      dispatch(setResponseError(error));
    },
    [dispatch]
  );
  return { error, setError };
};

export default useError;
