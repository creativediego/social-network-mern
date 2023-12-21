import * as React from 'react';
import '.././Posts.scss';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useToggleAnimation } from '../../../hooks/useToggleAnimation';
import { usePost } from '../../../hooks/usePost';
/**
 * Displays like button.
 */
const DislikeButton: React.FC = (): JSX.Element | null => {
  const userId = useAuthUser().user.id;
  const { post, handleDislikePost } = usePost();
  const { animationClass, handleAnimation } = useToggleAnimation(
    'fs-6 fa-pulse',
    800
  );

  /**
   * Checks if the user liked the post, and updates state used for styling.
   */
  const userHasDisliked = React.useMemo(() => {
    if (post && post.dislikedBy.includes(userId)) {
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
          handleDislikePost(post.id);
          handleAnimation();
        }}
      >
        <i
          className={
            userHasDisliked
              ? `fa-solid fa-thumbs-down ttr-stat-icon ${animationClass}`
              : 'far fa-thumbs-down ttr-stat-icon'
          }
        >
          <span data-testid='ttr-stats-dislikes' className='mx-1'>
            {post.stats.dislikes && post.stats.dislikes}
          </span>
        </i>
      </span>
    </div>
  ) : null;
};

export default DislikeButton;
