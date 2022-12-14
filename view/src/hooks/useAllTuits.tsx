import React, {
  useContext,
  useEffect,
  createContext,
  ReactNode,
  useCallback,
} from 'react';
import { ITuit } from '../interfaces/ITuit';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  findAllTuitsThunk,
  selectTuitsLoading,
  selectAllTuits,
  userLikesTuitThunk,
  userDislikesTuitThunk,
  deleteTuitThunk,
  removeAllTuits,
} from '../redux/tuitSlice';

const TuitContext = createContext<ITuit | null>(null);

/**
 * Context for a single tuit to give nested components (such as stats) access to its data.
 */
export const TuitProvider = ({
  tuit,
  children,
}: {
  tuit: ITuit;
  children: ReactNode;
}) => {
  return <TuitContext.Provider value={tuit}>{children}</TuitContext.Provider>;
};

/**
 * Custom hook that manages the state of fetching tuits, liking, disliking, and deleting.
 */
export const useAllTuits = () => {
  const tuits = useAppSelector(selectAllTuits);
  const loading = useAppSelector(selectTuitsLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(findAllTuitsThunk());
  }, [dispatch]);

  useEffect(() => {
    // Remove all tuits when component unmounts.
    return () => {
      dispatch(removeAllTuits());
    };
  }, [dispatch]);

  return {
    tuits,
    loading,
  };
};
