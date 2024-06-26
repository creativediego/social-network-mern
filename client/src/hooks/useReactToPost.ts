import { useCallback, useMemo } from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectPostLoading,
  userLikesPostThunk,
  userUnlikesPostThunk,
} from '../redux/postSlice';
import { usePost } from '../components/Posts/Post/hooks/usePost';
import { useAuthUser } from './useAuthUser';

/**
 * Custom React hook for managing user reactions to a post.
 * @returns {object} An object containing functions and states related to post reactions.
 */
export const useReactToPost = () => {
  // Get the current post and user from other custom hooks and Redux store
  const { post, setPost } = usePost();
  const { user } = useAuthUser();
  const loading = useAppSelector(selectPostLoading);
  const dispatch = useAppDispatch();

  // Determine if the current user has reacted to the post
  const userReacted = useMemo(
    () => post.likedBy.includes(user.id),
    [post.likedBy, user.id]
  );

  /**
   * `handleReaction` is a function that handles the user's reaction to a post.
   * It takes in `postId` as an argument.
   * The `postId` is the ID of the post to react to.
   * The function first checks if there is a post and returns if there isn't.
   * Then, it optimistically updates the post stats based on the user's reaction.
   * The `likedBy` array is updated to include or exclude the user's ID based on whether the user has reacted.
   * The `likes` count is incremented or decremented based on whether the user has reacted.
   * The `optimisticPost` object is the post with the updated `likedBy` array and `likes` count.
   * The function then fetches the updated post data from the API.
   * If the user has reacted, it dispatches the `userLikesPostThunk` action with the `postId` and `optimisticPost`.
   * If the user hasn't reacted, it dispatches the `userUnlikesPostThunk` action with the `postId` and `optimisticPost`.
   * Finally, the function updates the post in the context with the `optimisticPost`.
   *
   * @param {string} postId - The ID of the post to react to.
   *
   * @example
   * handleReaction(postId);
   *
   * @see {@link useCallback} for the hook that memoizes the `handleReaction` function.
   * @see {@link dispatch} for the function that dispatches actions to the Redux store.
   * @see {@link userLikesPostThunk} for the action that likes a post.
   * @see {@link userUnlikesPostThunk} for the action that unlikes a post.
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

      // Update the post in the context
      setPost(optimisticPost);
    },
    [dispatch, post, user.id, userReacted]
  );

  // Return the reaction handling function and related states
  return { handleReaction, loading, reacted: userReacted };
};
