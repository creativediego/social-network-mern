import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  findAllFollowers,
  followUser,
  unfollowUser,
} from '../../services/follows-service';
import { Loader } from '../../components';
import { setGlobalError } from '../../redux/errorSlice';
import { findUserById } from '../../services/users-service';
const FollowButton = ({ userToFollow, setProfileUser }) => {
  const [following, setFollowing] = useState(false);
  const authUser = useSelector((state) => state.user.data);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFollowUser = async () => {
    if (loading) return;
    setLoading(true);
    const res = await followUser(authUser.id, userToFollow.id);
    const updatedUser = await findUserById(res.followee);
    setLoading(false);
    if (res.error || updatedUser.error) {
      dispatch(
        setGlobalError({
          error:
            'We ran into an issue following the user. Please try again later.',
        })
      );
    }
    checkIfFollowing();
    setProfileUser({ ...userToFollow, ...updatedUser });
  };

  const handleUnfollowUser = async () => {
    if (loading) return;
    setLoading(true);
    const res = await unfollowUser(authUser.id, userToFollow.id);
    const updatedUser = await findUserById(res.followee);
    setLoading(false);
    if (res.error || updatedUser.error) {
      return dispatch(
        setGlobalError({
          error:
            'We ran into an issue unfollowing the user. Please try again later.',
        })
      );
    }
    checkIfFollowing();
    setProfileUser({ ...userToFollow, ...updatedUser });
  };
  const checkIfFollowing = async () => {
    if (!userToFollow.id) return;
    const res = await findAllFollowers(userToFollow.id);
    // If we have an error return it
    if (res.error) {
      dispatch(setGlobalError(res));
    } else {
      // Otherwise, check if the authUser is in the list of followers for this user.
      if (res.some((follower) => follower.username === authUser.username)) {
        setFollowing(true);
      } else {
        setFollowing(false);
      }
    }
  };

  useEffect(() => {
    checkIfFollowing();
  }, [userToFollow]);

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
