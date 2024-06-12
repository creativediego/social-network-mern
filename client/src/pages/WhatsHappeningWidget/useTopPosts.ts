import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectTopPosts,
  selectTopPostsLoading,
  findTopPostsByLikesThunk,
} from '../../redux/postSlice';
import { IQueryParams } from '../../interfaces/IQueryParams';

/**
 * `useTopPosts` is a custom hook that fetches and provides the top posts based on likes.
 * It takes in `limit` as an optional argument which specifies the maximum number of posts to fetch.
 * The default limit is 5.
 * The hook uses the `useAppSelector` and `useAppDispatch` hooks to get the current top posts, loading state, and dispatch function from the Redux store.
 * The `useEffect` hook is used to dispatch the `findTopPostsByLikesThunk` action when the component mounts.
 * The `findTopPostsByLikesThunk` action fetches the top posts based on likes.
 * The hook returns an object with the `posts` and `loading` states.
 *
 * @param {number} [limit=5] - The maximum number of posts to fetch.
 *
 * @returns {Object} The `posts` and `loading` states.
 * @property {IPost[]} posts - The top posts based on likes.
 * @property {boolean} loading - Whether the top posts are loading.
 *
 * @example
 * const { posts, loading } = useTopPosts(10);
 *
 * @see {@link useAppSelector} for the hook that selects state from the Redux store.
 * @see {@link useAppDispatch} for the hook that dispatches actions to the Redux store.
 * @see {@link useEffect} for the hook that dispatches the `findTopPostsByLikesThunk` action when the component mounts.
 * @see {@link findTopPostsByLikesThunk} for the action that fetches the top posts based on likes.
 */

export const useTopPosts = (limit?: number) => {
  const posts = useAppSelector(selectTopPosts);
  const loading = useAppSelector(selectTopPostsLoading);
  const dispatch = useAppDispatch();
  const queryParams: IQueryParams = { page: 2, limit: limit || 5 };
  useEffect(() => {
    dispatch(findTopPostsByLikesThunk(queryParams));
  }, []);

  return { posts, loading };
};
