import React from 'react';
import { Loader } from '..';
import { selectProfile } from '../../redux/profileSlice';

import { useProfile } from '../Profile/ProfileInfo/useProfile';
import { useAppSelector } from '../../redux/hooks';
import { IUser } from '../../interfaces/IUser';

/**
 * Displays the follow/unfollow button. Uses the useProfile hook to manage state and process submission.
 */
const FollowButton = (): JSX.Element => {
  const profileUser = useAppSelector(selectProfile);
  console.log(profileUser);
  const { loading, isFollowed, followUser, unfollowUser } = useProfile(
    profileUser.username
  );

  return (
    <span>
      {
        // If the authenticated user is following this user, display the unFollow button.
        // Otherwise, display the follow button
        isFollowed ? (
          <span
            className='btn btn-light mx-2 rounded-pill'
            onClick={unfollowUser}
          >
            <Loader loading={loading} content='Unfollow' />
          </span>
        ) : (
          <span className='btn btn-dark mx-2 rounded-pill' onClick={followUser}>
            <Loader loading={loading} content='Follow' />
          </span>
        )
      }
    </span>
  );
};

export default FollowButton;
