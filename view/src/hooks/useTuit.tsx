import React, {
  useContext,
  createContext,
  ReactNode,
  useCallback,
  useState,
} from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  selectTuitsLoading,
  userLikesTuitThunk,
  userDislikesTuitThunk,
  deleteTuitThunk,
} from '../redux/tuitSlice';

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
export const useTuit = () => {
  const tuit = useContext(TuitContext);
  const [showMenu, setShowMenu] = useState(false);
  const loading = useAppSelector(selectTuitsLoading);
  const dispatch = useAppDispatch();

  const handleShowMenu = useCallback(
    (status: boolean) => {
      setShowMenu(status);
    },
    [dispatch]
  );

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

  return {
    loading,
    tuit,
    showMenu,
    handleShowMenu,
    handleLikeTuit,
    handleDislikeTuit,
    handleDeleteTuit,
  };
};
