import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  findAllTuitsThunk,
  tuitsLoadingSelector,
  selectAllTuits,
} from '../redux/tuitSlice';

const useAllTuits = () => {
  const tuits = useAppSelector(selectAllTuits);
  const loading = useAppSelector(tuitsLoadingSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(findAllTuitsThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { tuits, loading };
};

export default useAllTuits;
