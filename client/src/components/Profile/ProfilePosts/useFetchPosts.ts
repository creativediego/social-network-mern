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
} from '../../../redux/postSlice';
import { useLocation } from 'react-router-dom';
import { IPost } from '../../../interfaces/IPost';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { IQueryParams } from '../../../interfaces/IQueryParams';

/**
 * Custom hook to fetch a user's profile posts and liked posts, along with loading state.
 *
 * @param {string} userId - The user ID for which to fetch posts.
 *
 * @returns {{
 *   myPosts: Array<IPost>,      // User's own posts.
 *   likedPosts: Array<IPost>,   // Posts liked by the user.
 *   loading: boolean            // True if the data is being fetched, false otherwise.
 *   lastElementRef: React.MutableRefObject<HTMLDivElement | null>;
 * }}
 */
export const useFetchPosts = (
  userId: string
): {
  posts: Array<IPost>;
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
    likedPosts,
    clearPosts,
    loading,
    lastElementRef,
    hasMore,
  };
};
