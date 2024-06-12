import { useMemo } from 'react';
import '.././Posts.scss';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { usePost } from '../Post/hooks/usePost';
import { useReactToPost } from '../../../hooks/useReactToPost';
import { ReactionButton } from '../../../components';
import { useToggleAnimation } from '../../../hooks/useToggleAnimation';

/**
 * `LikeButton` is a component that renders a like button for a post.
 *
 * It uses several hooks to get the necessary data and functions:
 * - `useAuthUser` to get the current user's ID
 * - `usePost` to get the current post and the post service
 * - `useReactToPost` to handle reactions to the post
 * - `useAlert` to set error messages
 * - `useToggleAnimation` to handle the animation of the button
 *
 * The button's appearance changes based on whether the current user has liked the post.
 *
 * @component
 * @example
 * Example usage of LikeButton component
 * <LikeButton />
 *
 * @returns {JSX.Element | null} A JSX element representing the like button, or null if there's no post.
 */

const LikeButton = (): JSX.Element | null => {
  const userId = useAuthUser().user.id;
  const { post } = usePost();
  const { handleReaction, loading } = useReactToPost();
  const { animationClass, handleAnimation } = useToggleAnimation(
    'fa-beat',
    1000
  );

  const userHasLiked = useMemo((): boolean => {
    if (post && post.likedBy.includes(userId)) {
      return true;
    }
    return false;
  }, [userId, post]);

  const getButtonClass = useMemo(() => {
    if (userHasLiked) {
      return 'fa-heart ttr-heart fa-solid text-danger';
    }
    return 'far fa-heart';
  }, [userHasLiked]);

  return (
    post && (
      <ReactionButton
        cssClass={`${getButtonClass} ${animationClass}`}
        handleClick={() => {
          handleAnimation();
          handleReaction(post.id);
        }}
        disabled={loading}
        reactions={post && post.stats.likes}
      />
    )
  );
};

export default LikeButton;
