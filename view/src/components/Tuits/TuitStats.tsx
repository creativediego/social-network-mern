import React from 'react';
import LikeButton from './LikeButton';
import DislikeButton from './DislikeButton';
import { useTuit } from '../../hooks/useTuit';

/**
 * Displays all stats of a tuit, including likes, dislikes, retuits, and replies.
 */
const TuitStats = (): JSX.Element | null => {
  const { tuit } = useTuit();
  return tuit ? (
    <div className='row mt-2'>
      {/* <div className='col'>
        <i className='far fa-message ttr-stat-icon'>
          <span data-testid='ttr-stats-replies' className='mx-1'>
            {tuit.stats.replies}
          </span>
        </i>
      </div> */}
      {/* <div className='col'>
        <i className='far fa-retweet ttr-stat-icon'>
          <span data-testid='ttr-stats-retuits' className='mx-1'>
            {tuit.stats.retuits}
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

export default TuitStats;
