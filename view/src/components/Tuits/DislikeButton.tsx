import * as React from 'react';
import { useSelector } from 'react-redux';
import { TuitContext } from './Tuit';
import './Tuits.scss';
import { userDislikesTuit } from '../../services/likes-service';
import { setClassWithTimeout } from './helpers';
/**
 * Displays like button.
 */
const DislikeButton: React.FC = (): JSX.Element => {
  const [tuit, setTuit] = React.useContext(TuitContext);
  const userId = useSelector((state:any ) => state.user.data.id);
  const [animationClass, setAnimationClass] = React.useState('');

  /**
   * Checks if the user liked the tuit, and updates state used for styling.
   */
  const userHasDisliked = React.useMemo(() => {
    if (tuit.dislikedBy.includes(userId)) {
      return true;
    }
    return false;
  }, [userId, tuit]);

  const handleDislikeTuit = async () => {
    const resTuit = await userDislikesTuit(userId, tuit.id);
    if (resTuit.error) {
      return;
    }
    setTuit({ ...tuit, ...resTuit });
    setClassWithTimeout(setAnimationClass, 'fs-6 fa-pulse');
  };

  return (
    <div className='col'>
      <span
        className='btn p-0 m-0'
        data-testid='ttr-like-btn'
        onClick={() => handleDislikeTuit()}
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
  );
}

export default DislikeButton;
