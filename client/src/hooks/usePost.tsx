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
  selectPostsLoading,
  userLikesPostThunk,
  userDislikesPostThunk,
  deletePostThunk,
} from '../redux/postSlice';

const PostContext = createContext<IPost | null>(null);

/**
 * Context for a single post to give nested components (such as stats) access to its data.
 */
export const PostProvider = ({
  post,
  children,
}: {
  post: IPost;
  children: ReactNode;
}) => {
  return <PostContext.Provider value={post}>{children}</PostContext.Provider>;
};

/**
 * Custom hook that manages the state of fetching posts, liking, disliking, and deleting.
 */
export const usePost = () => {
  const post = useContext(PostContext);
  const [showMenu, setShowMenu] = useState(false);
  const loading = useAppSelector(selectPostsLoading);
  const dispatch = useAppDispatch();

  const handleShowMenu = useCallback((status: boolean) => {
    setShowMenu(status);
  }, []);

  const handleLikePost = useCallback(
    async (postId: string) => {
      await dispatch(userLikesPostThunk(postId));
    },
    [dispatch]
  );

  const handleDislikePost = useCallback(
    (postId: string) => {
      dispatch(userDislikesPostThunk(postId));
    },
    [dispatch]
  );

  const handleDeletePost = useCallback(
    async (postId: string) => {
      await dispatch(deletePostThunk(postId));
    },
    [dispatch]
  );

  return {
    loading,
    post,
    showMenu,
    handleShowMenu,
    handleLikePost,
    handleDislikePost,
    handleDeletePost,
  };
};
