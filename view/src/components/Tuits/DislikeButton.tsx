import * as React from 'react';
import './Tuits.scss';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useToggleAnimation } from '../../hooks/useToggleAnimation';
import { useTuit } from '../../hooks/useTuit';
/**
 * Displays like button.
 */
const DislikeButton: React.FC = (): JSX.Element | null => {
  const userId = useAuthUser().user.id;
  const { tuit, handleDislikeTuit } = useTuit();
  const { animationClass, handleAnimation } = useToggleAnimation(
    'fs-6 fa-pulse',
    800
  );

  /**
   * Checks if the user liked the tuit, and updates state used for styling.
   */
  const userHasDisliked = React.useMemo(() => {
    if (tuit && tuit.dislikedBy.includes(userId)) {
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
          handleDislikeTuit(tuit.id);
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
            {tuit.stats.dislikes && tuit.stats.dislikes}
          </span>
        </i>
      </span>
    </div>
  ) : null;
};

export default DislikeButton;
