import { useEffect, createContext, ReactNode } from 'react';
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
 * `useAllPosts` is a custom hook that manages the state of fetching posts, liking, disliking, and deleting.
 * It uses several selectors from the `postSlice` to get the current post state from the Redux store.
 * It also uses the `useAppDispatch` hook to get the dispatch function from the Redux store.
 * The `fetchPosts` function is used to dispatch the `findAllPostsThunk` action to the Redux store.
 * The `queryParams` object is used as the query parameters for fetching posts.
 *
 * @returns {Object} The state and functions related to the posts.
 *
 * @example
 * const { posts, loading, hasMore, fetchPosts } = useAllPosts();
 * fetchPosts(queryParams);
 *
 * @see {@link useAppSelector} for the hook that selects state from the Redux store.
 * @see {@link useAppDispatch} for the hook that dispatches actions to the Redux store.
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
