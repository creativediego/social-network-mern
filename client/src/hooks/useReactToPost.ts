import { useCallback, useEffect, useMemo } from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  removeAllPosts,
  removePost,
  selectPostLoading,
  userLikesPostThunk,
  userUnlikesPostThunk,
} from '../redux/postSlice';
import { usePost } from '../components/Posts/Post/hooks/usePost';
import { useAuthUser } from './useAuthUser';
import { useDispatch } from 'react-redux';

/**
 * Custom React hook for managing user reactions to a post.
 * @returns {object} An object containing functions and states related to post reactions.
 */
export const useReactToPost = () => {
  // Get the current post and user from other custom hooks and Redux store
  const { post } = usePost();
  const { user } = useAuthUser();
  const loading = useAppSelector(selectPostLoading);
  const dispatch = useAppDispatch();

  // Determine if the current user has reacted to the post
  const userReacted = useMemo(
    () => post.likedBy.includes(user.id),
    [post.likedBy, user.id]
  );

  /**
   * Function to handle post reaction.
   * @param {string} postId - ID of the post to react to.
   */
  const handleReaction = useCallback(
    async (postId: string) => {
      if (!post) return;

      // Optimistically update the post stats based on user reaction
      const likedBy = userReacted
        ? post.likedBy.filter((id) => id !== user.id)
        : [...post.likedBy, user.id];
      const likes =
        post.stats.likes + (userReacted ? (post.stats.likes > 0 ? -1 : 0) : 1);

      const optimisticPost: IPost = {
        ...post,
        likedBy,
        stats: {
          ...post.stats,
          likes,
        },
      };

      // Fetch updated post data from the API
      if (!userReacted) {
        dispatch(userLikesPostThunk({ postId, optimisticPost }));
      } else {
        dispatch(userUnlikesPostThunk({ postId, optimisticPost }));
      }
    },
    [dispatch, post, user.id, userReacted]
  );

  // Return the reaction handling function and related states
  return { handleReaction, loading, reacted: userReacted };
};
