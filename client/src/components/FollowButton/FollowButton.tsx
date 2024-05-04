import { Loader } from '..';
import { useFollow } from './useFollow';

interface FollowButtonProps {
  userId: string;
}
/**
 * Displays the follow/unfollow button. Uses the useProfile hook to manage state and process submission.
 */
const FollowButton = ({ userId }: FollowButtonProps): JSX.Element => {
  const { loading, isFollowed, followUser, unfollowUser } = useFollow(userId);
  return (
    <span>
      {
        // If the authenticated user is following this user, display the unFollow button.
        // Otherwise, display the follow button
        isFollowed ? (
          <button
            disabled={loading}
            className='btn btn-light mx-2 rounded-pill'
            onClick={unfollowUser}
          >
            <Loader loading={loading} content='Unfollow' />
          </button>
        ) : (
          <button
            disabled={loading}
            className='btn btn-dark mx-2 rounded-pill'
            onClick={followUser}
          >
            <Loader loading={loading} content='Follow' />
          </button>
        )
      }
    </span>
  );
};

export default FollowButton;
