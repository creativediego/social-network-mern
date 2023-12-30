import { useCallback, useEffect, useRef, useState } from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch } from '../redux/hooks';
import { updatePosts } from '../redux/postSlice';
import { usePost } from './usePost';

export const useLikeDislikePost = (
  apiCall: (postId: string) => Promise<IPost>,
  setError: (message: string) => void
) => {
  const [loading, setLoading] = useState(false);
  const { updatePost } = usePost();
  const isMounted = useRef(false);
  const dispatch = useAppDispatch();

  const handleLikeDislike = useCallback(
    async (postId: string) => {
      try {
        setLoading(true);
        const updatedPost = await apiCall(postId);
        setLoading(false);
        if (isMounted.current) {
          dispatch(updatePosts(updatedPost));
          updatePost(updatedPost);
        }
      } catch (err) {
        setLoading(false);
        const error = err as Error;
        if (isMounted.current) {
          setError(error.message);
        }
      }
    },
    [dispatch, setError, apiCall, updatePost]
  );

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  });

  return { handleLikeDislike, loading };
};
