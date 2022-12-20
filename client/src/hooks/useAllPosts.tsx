import React, { useEffect, createContext, ReactNode } from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  findAllPostsThunk,
  selectPostsLoading,
  selectAllPosts,
  removeAllPosts,
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
export const useAllPosts = () => {
  const posts = useAppSelector(selectAllPosts);
  const loading = useAppSelector(selectPostsLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(findAllPostsThunk());
  }, [dispatch]);

  useEffect(() => {
    // Remove all posts when component unmounts.
    return () => {
      dispatch(removeAllPosts());
    };
  }, [dispatch]);

  return {
    posts,
    loading,
  };
};
