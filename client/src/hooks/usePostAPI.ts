import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { deletePostThunk, updatePosts } from '../redux/postSlice';
import { IPost } from '../interfaces/IPost';
import { useAlert } from './useAlert';

/**
 * `usePostAPI` is a custom hook that provides functions to interact with the post API.
 * It uses the `useAppDispatch` and `useAlert` hooks to get the dispatch function and `setError` function.
 * It also uses the `useRef` and `useState` hooks from React to manage the `isMounted` and `loading` states.
 * The `likeDislikePost` function is used to like or dislike a post.
 * It takes in `postId` and `apiCall` as arguments.
 * The `postId` is the ID of the post to like or dislike.
 * The `apiCall` is the API call to like or dislike the post.
 *
 * @returns {Object} The state and functions related to the post API.
 * @property {boolean} loading - Whether the post API is loading.
 * @property {(postId: string, apiCall: (postId: string) => Promise<IPost>) => Promise<IPost | undefined>} likeDislikePost - The function to like or dislike a post.
 *
 * @example
 * const { loading, likeDislikePost } = usePostAPI();
 * likeDislikePost(postId, apiCall);
 *
 * @see {@link useAppDispatch} for the hook that dispatches actions to the Redux store.
 * @see {@link useAlert} for the hook that provides the `setError` function.
 * @see {@link useRef} for the hook that manages the `isMounted` ref.
 * @see {@link useState} for the hook that manages the `loading` state.
 * @see {@link useCallback} for the hook that memoizes the `likeDislikePost` function.
 * @see {@link useEffect} for the hook that updates the `isMounted` ref when the component mounts and unmounts.
 */
export const usePostAPI = () => {
  const dispatch = useAppDispatch();
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const { setError } = useAlert();

  const likeDislikePost = useCallback(
    async (postId: string, apiCall: (postId: string) => Promise<IPost>) => {
      try {
        setLoading(true);
        const updatedPost = await apiCall(postId);
        setLoading(false);
        if (isMounted.current) {
          dispatch(updatePosts(updatedPost));
          return updatedPost;
        }
      } catch (err) {
        setLoading(false);
        const error = err as Error;
        if (isMounted.current) {
          setError(error.message);
        }
      }
    },
    [dispatch]
  );

  const deletePost = useCallback(
    async (postId: string) => {
      await dispatch(deletePostThunk(postId));
    },
    [dispatch]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    likeDislikePost,
    deletePost,
    loading,
  };
};
