import { Loader } from '..';
import { useFollow } from './useFollow';

interface FollowButtonProps {
  userId: string;
}
/**
 * `FollowButton` is a component that displays a button for following or unfollowing a user.
 * It uses the `useFollow` custom hook to manage state and process the follow/unfollow action.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.userId - The ID of the user to follow or unfollow.
 *
 * @returns {JSX.Element} The `FollowButton` component, which includes the follow/unfollow button.
 * The button's appearance and behavior depend on the following state variables:
 * - `loading`: A boolean indicating whether the follow/unfollow operation is in progress.
 * - `isFollowed`: A boolean indicating whether the user is already followed.
 * The button also provides `followUser` and `unfollowUser` functions that can be called when the button is clicked.
 *
 * @example
 * <FollowButton userId={userId} />
 *
 * @see {@link useFollow} for the hook that provides the follow state and actions.
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
