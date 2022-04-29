import React, { useContext } from 'react';
import { TuitContext } from './Tuit';
import LikeButton from './LikeButton';
import DislikeButton from './DislikeButton';

/**
 * Displays all stats of a tuit, including likes, dislikes, retuits, and replies.
 */
const TuitStats = () => {
  const [tuit] = useContext(TuitContext);
  return (
    <div className='row mt-2'>
      <div className='col'>
        <i className='far fa-message ttr-stat-icon'>
          <span data-testid='ttr-stats-replies' className='mx-1'>
            {tuit.stats && tuit.stats.replies}
          </span>
        </i>
      </div>
      <div className='col'>
        <i className='far fa-retweet ttr-stat-icon'>
          <span data-testid='ttr-stats-retuits' className='mx-1'>
            {tuit.stats && tuit.stats.retuits}
          </span>
        </i>
      </div>
      <div className='col'>
        <div className='d-flex'>
          <LikeButton />
          <DislikeButton />
        </div>
      </div>
      <div className='col'>
        <i className='far fa-inbox-out btn ttr-stat-icon'></i>
      </div>
    </div>
  );
};

TuitStats.defaultProps = {
  tuit: {
    stats: {
      likes: 0,
      dislikes: 0,
      replies: 0,
      retuis: 0,
    },
  },
};
export default TuitStats;
