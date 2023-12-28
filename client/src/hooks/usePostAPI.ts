import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setGlobalError } from '../redux/alertSlice';
import { deletePostThunk, updatePosts } from '../redux/postSlice';
import { IPost } from '../interfaces/IPost';

export const usePostAPI = () => {
  const dispatch = useAppDispatch();
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);

  const likeDislikePost = useCallback(
    async (postId: string, apiCall: (postId: string) => Promise<IPost>) => {
      try {
        setLoading(true);
        const updatedPost = await apiCall(postId);
        console.log(updatedPost);
        setLoading(false);
        if (isMounted.current) {
          dispatch(updatePosts(updatedPost));
        }
      } catch (err) {
        setLoading(false);
        const error = err as Error;
        if (isMounted.current) {
          dispatch(setGlobalError({ message: error.message }));
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
