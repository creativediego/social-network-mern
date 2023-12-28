import React, { useMemo } from 'react';
import '.././Posts.scss';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { usePost } from '../../../hooks/usePost';
/**
 * Displays like button.
 */

interface LikeButtonProps {
  type: 'like' | 'dislike';
}

const LikeDislikeButton = ({ type }: LikeButtonProps): JSX.Element | null => {
  const userId = useAuthUser().user.id;
  const { post, handleLikePost, handleDislikePost, loading } = usePost();

  const userHasLiked = useMemo((): boolean => {
    if (post && post.likedBy.includes(userId)) {
      return true;
    }
    return false;
  }, [userId, post]);

  const userHasDisliked = useMemo(() => {
    if (post && post.dislikedBy.includes(userId)) {
      return true;
    }
    return false;
  }, [userId, post]);

  const getButtonClass = useMemo(() => {
    if (type === 'like') {
      if (userHasLiked) {
        return 'fa-heart ttr-heart fa-solid text-danger';
      }
      return 'far fa-heart';
    }
    if (userHasDisliked) {
      return 'fa-thumbs-down fa-solid';
    }
    return 'far fa-thumbs-down';
  }, [type, userHasLiked, userHasDisliked]);

  return post ? (
    <div className='col'>
      <span
        className='btn p-0 m-0'
        data-testid='ttr-like-btn'
        onClick={() => {
          type === 'like'
            ? handleLikePost(post.id)
            : handleDislikePost(post.id);
        }}
      >
        <i
          className={`${getButtonClass} ttr-stat-icon ${
            loading ? 'fs-6 fa-beat' : ''
          }`}
        >
          <span data-testid='ttr-stats-likes' className='mx-1'>
            {type === 'like' && post.stats.likes && post.stats.likes}
            {type === 'dislike' && post.stats.dislikes && post.stats.dislikes}
          </span>
        </i>
      </span>
    </div>
  ) : null;
};

export default LikeDislikeButton;
