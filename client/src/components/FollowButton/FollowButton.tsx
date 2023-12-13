import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  findAllFollowers,
  followUser,
  unfollowUser,
} from '../../services/follows-service';
import { Loader } from '..';
import { setGlobalError } from '../../redux/alertSlice';
import { findUserById } from '../../services/users-service';
import { IUser } from '../../interfaces/IUser';
import { isError } from '../../services/api-helpers';
import { FriendlyError } from '../../interfaces/IError';

interface FollowButtonProps {
  userToFollow: IUser;
  setProfileUser?: React.Dispatch<React.SetStateAction<IUser>>;
}
const FollowButton = ({
  userToFollow,
  setProfileUser,
}: FollowButtonProps): JSX.Element => {
  const [following, setFollowing] = React.useState(false);
  const authUser = useSelector((state: any) => state.user.data);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();

  const handleFollowUser = async () => {
    if (loading) return;
    setLoading(true);
    const res = await followUser(authUser.id, userToFollow.id);
    const updatedUser = await findUserById(res.followee);
    setLoading(false);
    if (isError(res) || isError(updatedUser)) {
      dispatch(
        setGlobalError(
          new FriendlyError('We ran into an issue following user.')
        )
      );
    }
    checkIfFollowing();
    if (setProfileUser) setProfileUser({ ...userToFollow, ...updatedUser });
  };

  const handleUnfollowUser = async () => {
    if (loading) return;
    setLoading(true);
    const unfollowedUser = await unfollowUser(authUser.id, userToFollow.id);
    const updatedUser = await findUserById(unfollowedUser.followee);
    setLoading(false);
    if (isError(unfollowedUser) || isError(updatedUser)) {
      return dispatch(
        setGlobalError(
          new FriendlyError(
            'We ran into an issue unfollowing the user. Please try again later.'
          )
        )
      );
    }
    checkIfFollowing();
    if (setProfileUser) setProfileUser({ ...userToFollow, ...updatedUser });
  };
  const checkIfFollowing = useCallback(async () => {
    if (!userToFollow.id) return;
    const res = await findAllFollowers(userToFollow.id);
    // If we have an error return it
    if (res.error) {
      dispatch(setGlobalError(res.error));
    } else {
      // Otherwise, check if the authUser is in the list of followers for this user.
      if (
        res.some((follower: IUser) => follower.username === authUser.username)
      ) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
  }, [authUser.username, dispatch, userToFollow.id]);

  React.useEffect(() => {
    checkIfFollowing();
  }, [userToFollow, checkIfFollowing]);

  return (
    <span>
      {
        // If the authenticated user is following this user, display the unFollow button.
        // Otherwise, display the follow button
        following ? (
          <span
            className='btn btn-light mx-2 rounded-pill'
            onClick={handleUnfollowUser}
          >
            <Loader loading={loading} content='Unfollow' />
          </span>
        ) : (
          <span
            className='btn btn-dark mx-2 rounded-pill'
            onClick={handleFollowUser}
          >
            <Loader loading={loading} content='Follow' />
          </span>
        )
      }
    </span>
  );
};

export default FollowButton;
