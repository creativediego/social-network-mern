import { useCallback, useMemo, useState } from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch } from '../redux/hooks';
import { updatePosts } from '../redux/postSlice';
import { usePost } from '../components/Posts/Post/hooks/usePost';
import { useAuthUser } from './useAuthUser';
import { useIsMounted } from './useIsMounted';

/**
 * Custom hook for handling reactions to a post
 * @param {Function} apiCall - Function to call API for updating post reactions
 * @param {Function} setError - Function to handle error messages
 * @returns {Object} - Object containing the reaction handling function, loading state, and reacted state
 */
export const useReactToPost = (
  apiCall: (postId: string) => Promise<IPost>,
  setError: (message: string) => void
) => {
  // State hooks and references
  const isMounted = useIsMounted();
  const { post } = usePost();
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Determine if the current user has reacted to the post
  const userReacted = useMemo(
    () => post && post.likedBy.includes(user.id),
    [post, user.id]
  );

  /**
   * Function to handle post reaction
   * @param {string} postId - ID of the post to react to
   */
  const handleReaction = useCallback(
    async (postId: string) => {
      if (!post) return;

      const rollbackPost = post;

      try {
        setLoading(true);
        // Optimistically update the post stats based on user reaction
        const optimisticPost: IPost = {
          ...post,
          likedBy: [...post.likedBy, user.id],
          stats: {
            ...post.stats,
            likes:
              post.stats.likes +
              (userReacted ? (post.stats.likes > 0 ? -1 : 0) : 1),
          },
        };

        // Dispatch the optimistic post update
        dispatch(updatePosts(optimisticPost));

        // Fetch updated post data from the API
        const updatedPost = await apiCall(postId);

        setLoading(false);

        // Update the post if the component is still mounted
        if (isMounted) {
          dispatch(updatePosts(updatedPost));
        }
      } catch (err) {
        setLoading(false);
        dispatch(updatePosts(rollbackPost));

        const error = err as Error;
        // Set error message if the component is still mounted
        if (isMounted) {
          setError(error.message);
        }
      }
    },
    [dispatch, setError, apiCall, post, userReacted]
  );

  // Determine if the current user has reacted and not loading
  const reacted = userReacted && !loading;

  // Return the reaction handling function and related states
  return { handleReaction, loading, reacted };
};
