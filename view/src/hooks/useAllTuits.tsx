import React, {
  useContext,
  useEffect,
  createContext,
  ReactNode,
  useCallback,
} from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  findAllPostsThunk,
  selectTuitsLoading,
  selectAllTuits,
  userLikesPostThunk,
  userDislikesPostThunk,
  deletePostThunk,
  removeAllTuits,
} from '../redux/postSlice';

const TuitContext = createContext<IPost | null>(null);

/**
 * Context for a single tuit to give nested components (such as stats) access to its data.
 */
export const TuitProvider = ({
  tuit,
  children,
}: {
  tuit: IPost;
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
    dispatch(findAllPostsThunk());
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
