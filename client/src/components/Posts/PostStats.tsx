import React from 'react';
import LikeButton from './LikeButton';
import DislikeButton from './DislikeButton';
import { usePost } from '../../hooks/usePost';

/**
 * Displays all stats of a post, including likes, dislikes, reposts, and replies.
 */
const PostStats = (): JSX.Element | null => {
  const { post } = usePost();
  return post ? (
    <div className='row mt-2'>
      {/* <div className='col'>
        <i className='far fa-message ttr-stat-icon'>
          <span data-testid='ttr-stats-replies' className='mx-1'>
            {post.stats.replies}
          </span>
        </i>
      </div> */}
      {/* <div className='col'>
        <i className='far fa-retweet ttr-stat-icon'>
          <span data-testid='ttr-stats-reposts' className='mx-1'>
            {post.stats.reposts}
          </span>
        </i>
      </div> */}
      <div className='col'>
        <div className='d-flex'>
          <LikeButton />
          <DislikeButton />
        </div>
      </div>
      {/* <div className='col'>
        <i className='far fa-inbox-out btn ttr-stat-icon'></i>
      </div> */}
    </div>
  ) : null;
};

export default PostStats;
