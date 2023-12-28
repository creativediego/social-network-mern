import React from 'react';
import LikeDislikeButton from '../LikeDislikeButton/LikeDislikeButton';
import { usePost } from '../../../hooks/usePost';

/**
 * Displays all stats of a post, including likes, dislikes, reposts, and replies.
 */
const PostStats = (): JSX.Element | null => {
  const { post } = usePost();
  return post ? (
    <div className='row mt-2'>
      <div className='col'>
        <div className='d-flex'>
          <LikeDislikeButton type='like' />
          <LikeDislikeButton type='dislike' />
        </div>
      </div>
    </div>
  ) : null;
};

export default PostStats;
