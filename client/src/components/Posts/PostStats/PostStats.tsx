import React from 'react';
import LikeButton from '../LikeButton/LikeButton';
import DislikeButton from '../DislikeButton/DislikeButton';
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
          <LikeButton />
          <DislikeButton />
        </div>
      </div>
    </div>
  ) : null;
};

export default PostStats;
