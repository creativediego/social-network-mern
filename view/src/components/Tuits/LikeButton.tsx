import React, { useMemo } from 'react';
import './Tuits.scss';
import { useTuits } from '../../hooks/useTuits';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useToggleAnimation } from '../../hooks/useToggleAnimation';
/**
 * Displays like button.
 */
const LikeButton = (): JSX.Element | null => {
  const userId = useAuthUser().user.id;
  const { tuit, handleLikeTuit } = useTuits();
  const { animationClass, handleAnimation } = useToggleAnimation(
    'fs-6 fa-pulse',
    800
  );

  /**
   * Checks if the user liked the tuit, and updates state used for styling.
   */
  const userHasLiked = useMemo((): boolean => {
    if (tuit && tuit.likedBy.includes(userId)) {
      return true;
    }
    return false;
  }, [userId, tuit]);

  return tuit ? (
    <div className='col'>
      <span
        className='btn p-0 m-0'
        data-testid='ttr-like-btn'
        onClick={() => {
          handleLikeTuit(tuit.id);
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
            {tuit.stats.likes && tuit.stats.likes}
          </span>
        </i>
      </span>
    </div>
  ) : null;
};

export default LikeButton;
