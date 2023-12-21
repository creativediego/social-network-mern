import React, { useMemo } from 'react';
import '.././Posts.scss';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useToggleAnimation } from '../../../hooks/useToggleAnimation';
import { usePost } from '../../../hooks/usePost';
/**
 * Displays like button.
 */
const LikeButton = (): JSX.Element | null => {
  const userId = useAuthUser().user.id;
  const { post, handleLikePost } = usePost();
  const { animationClass, handleAnimation } = useToggleAnimation(
    'fs-6 fa-pulse',
    800
  );

  /**
   * Checks if the user liked the post, and updates state used for styling.
   */
  const userHasLiked = useMemo((): boolean => {
    if (post && post.likedBy.includes(userId)) {
      return true;
    }
    return false;
  }, [userId, post]);

  return post ? (
    <div className='col'>
      <span
        className='btn p-0 m-0'
        data-testid='ttr-like-btn'
        onClick={() => {
          handleLikePost(post.id);
          handleAnimation();
        }}
      >
        <i
          className={
            userHasLiked
              ? `fa-solid text-danger fa-heart ttr-heart ttr-stat-icon  ${animationClass}`
              : 'far fa-heart ttr-heart ttr-stat-icon'
          }
        >
          <span data-testid='ttr-stats-likes' className='mx-1'>
            {post.stats.likes && post.stats.likes}
          </span>
        </i>
      </span>
    </div>
  ) : null;
};

export default LikeButton;
