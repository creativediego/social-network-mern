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
} from '../redux/tuitSlice';
import { useAuthUser } from './useAuthUser';

const TuitContext = createContext<ITuit | null>(null);

export const TuitProvider = ({
  tuit,
  children,
}: {
  tuit: ITuit;
  children: ReactNode;
}) => {
  return <TuitContext.Provider value={tuit}>{children}</TuitContext.Provider>;
};

export const useTuits = () => {
  const tuits = useAppSelector(selectAllTuits);
  const tuit = useContext(TuitContext);
  const loading = useAppSelector(selectTuitsLoading);
  const dispatch = useAppDispatch();

  const handleLikeTuit = useCallback(
    async (tuitId: string) => {
      await dispatch(userLikesTuitThunk(tuitId));
    },
    [dispatch]
  );

  const handleDislikeTuit = useCallback(
    (tuitId: string) => {
      dispatch(userDislikesTuitThunk(tuitId));
    },
    [dispatch]
  );

  const handleDeleteTuit = useCallback(
    async (tuitId: string) => {
      await dispatch(deleteTuitThunk(tuitId));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(findAllTuitsThunk());
  }, [dispatch]);

  return {
    tuits,
    loading,
    tuit,
    handleLikeTuit,
    handleDislikeTuit,
    handleDeleteTuit,
  };
};
