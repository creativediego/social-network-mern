import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

import {
  selectAllPosts,
  findUserPostsThunk,
  removeAllPosts,
  selectPostsLoading,
  findLikedPostsThunk,
  selectAllPostsLikedByUser,
  selectHasMorePosts,
  findAllPostsThunk,
  selectAllPostsByUser,
} from '../../../redux/postSlice';
import { useLocation } from 'react-router-dom';
import { IPost } from '../../../interfaces/IPost';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { IQueryParams } from '../../../interfaces/IQueryParams';

/**
 * `useFetchPosts` is a custom hook that fetches a user's posts, liked posts, and loading state.
 * It uses the `useLocation` hook from `react-router-dom` to get the current location, the `useAppDispatch` and `useAppSelector` hooks from Redux to dispatch actions and select state from the Redux store, and the `useState` and `useEffect` hooks from React to manage the state and side effects.
 * It also provides a `lastElementRef` that can be attached to the last element of the posts list for infinite scrolling.
 *
 * @param {string} userId - The user ID for which to fetch posts.
 *
 * @returns {{
 *   posts: Array<IPost>;               // All posts.
 *   userPosts: Array<IPost>;           // User's own posts.
 *   likedPosts: Array<IPost>;          // Posts liked by the user.
 *   clearPosts: () => void;            // Function to clear the posts.
 *   loading: boolean;                  // True if the data is being fetched, false otherwise.
 *   lastElementRef: React.MutableRefObject<HTMLDivElement | null>; // Ref attached to the last post element.
 *   hasMore: boolean;                  // True if there are more posts to load, false otherwise.
 * }}
 *
 * @example
 * const { posts, userPosts, likedPosts, clearPosts, loading, lastElementRef, hasMore } = useFetchPosts(userId);
 *
 * @see {@link useLocation} for the hook that provides the current location.
 * @see {@link useAppDispatch} and {@link useAppSelector} for the hooks that dispatch actions and select state from the Redux store.
 * @see {@link useState} and {@link useEffect} for the hooks that manage the state and side effects.
 */
export const useFetchPosts = (
  userId: string
): {
  posts: Array<IPost>;
  userPosts: Array<IPost>;
  likedPosts: Array<IPost>; // Posts liked by the user.
  clearPosts: () => void;
  loading: boolean; // True if the data is being fetched, false otherwise.
  lastElementRef: React.MutableRefObject<HTMLDivElement | null>;
  hasMore: boolean;
} => {
  // Get the current location from React Router
  const location = useLocation();
  // Extract the page information from the URL
  const url = location.pathname.split('/')[2];
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);
  const userPosts = useAppSelector(selectAllPostsByUser);
  const likedPosts = useAppSelector(selectAllPostsLikedByUser);
  const loading = useAppSelector(selectPostsLoading);
  const hasMore = useAppSelector(selectHasMorePosts);

  const fetchPosts = useCallback(
    async (queryParams: IQueryParams) => {
      if (userId && url === 'posts') {
        dispatch(findUserPostsThunk({ userId, queryParams }));
      } else if (userId && url === 'likes') {
        dispatch(findLikedPostsThunk({ userId, queryParams }));
      } else if (userId && !url) {
        dispatch(findAllPostsThunk(queryParams));
      }
    },
    [dispatch, userId, url]
  );

  // useMemo to store default query Params
  const limit = 10;
  const defaultQueryParams = useMemo(
    () => ({
      page: 1,
      limit,
    }),
    []
  );

  const { lastElementRef } = useInfiniteScroll(
    fetchPosts,
    defaultQueryParams,
    loading,
    hasMore
  );

  const clearPosts = useCallback(() => {
    dispatch(removeAllPosts());
  }, [dispatch]);

  useEffect(() => {
    // Initial fetch of posts
    fetchPosts(defaultQueryParams);
    // Clean up posts when the component unmounts
    return () => {
      dispatch(removeAllPosts());
    };
  }, [dispatch, fetchPosts, defaultQueryParams]);

  // Return the user's own posts, liked posts, and loading state
  return {
    posts,
    userPosts,
    likedPosts,
    clearPosts,
    loading,
    lastElementRef,
    hasMore,
  };
};
