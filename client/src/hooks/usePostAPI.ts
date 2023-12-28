import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { deletePostThunk, updatePosts } from '../redux/postSlice';
import { IPost } from '../interfaces/IPost';
import { useAlert } from './useAlert';

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
