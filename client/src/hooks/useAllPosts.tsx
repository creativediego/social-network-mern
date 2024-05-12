import React, { useEffect, createContext, ReactNode } from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import {
  selectAllPosts,
  removeAllPosts,
  findAllPostsThunk,
  selectPostsLoading,
  selectHasMorePosts,
} from '../redux/postSlice';
import { useInfiniteScroll } from './useInfiniteScroll';
import { IQueryParams } from '../interfaces/IQueryParams';

const PostContext = createContext<IPost | null>(null);

/**
 * Custom hook that returns the post from the PostContext. Creates context for a single post to give nested components (such as stats) access to its data.
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
  const hasMore = useAppSelector(selectHasMorePosts);
  const dispatch = useAppDispatch();
  const fetchPosts = async (queryParams: IQueryParams) => {
    dispatch(findAllPostsThunk(queryParams));
  };
  const queryParams = { page: 0, limit: 3 };
  const { lastElementRef } = useInfiniteScroll(
    fetchPosts,
    queryParams,
    loading,
    hasMore
  );

  useEffect(() => {
    return () => {
      dispatch(removeAllPosts());
    };
  }, [dispatch]);

  return {
    posts,
    loading,
    lastElementRef,
    hasMore,
  };
};
