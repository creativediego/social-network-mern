import React, { useContext, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TuitContext } from './Tuit';
import { userLikesTuit } from '../../services/likes-service';
import './Tuits.css';
import { setClassWithTimeout } from './helpers';
/**
 * Displays like button.
 */
function LikeButton() {
  const userId = useSelector((state) => state.user.data.id);
  const [tuit, setTuit] = useContext(TuitContext);
  const [animationClass, setAnimationClass] = useState('');

  /**
   * Checks if the user liked the tuit, and updates state used for styling.
   */
  const userHasLiked = useMemo(() => {
    if (tuit.likedBy.includes(userId)) {
      return true;
    }
    return false;
  }, [userId, tuit]);

  /**
   * Calls the likes service when a user likes a tuit. Uses the updated tuit stats from the service to update state.
   */
  const handleLikeTuit = async () => {
    const resTuit = await userLikesTuit(userId, tuit.id);
    if (resTuit && resTuit.error) {
      return;
    }

    // updateLiked(resTuit);
    setTuit({ ...tuit, ...resTuit });
    setClassWithTimeout(setAnimationClass, 'fs-6 ttr-heart-animated fa-pulse');
  };

  return (
    <div className='col'>
      <span
        className='btn p-0 m-0'
        data-testid='ttr-like-btn'
        onClick={() => handleLikeTuit()}
      >
        <i
          className={
            userHasLiked
              ? `fa-solid text-danger fa-heart ttr-heart ttr-stat-icon  ${animationClass}`
              : 'far fa-heart ttr-heart ttr-stat-icon'
          }
        >
          <span data-testid='ttr-stats-likes' className='mx-1'>
            {tuit.stats.likes && tuit.stats.likes}
          </span>
        </i>
      </span>
    </div>
  );
}

export default LikeButton;
