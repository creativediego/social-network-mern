import React, { memo } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, ProfileInfo, ProfilePosts } from '../../components';
import { useProfile } from '../../components/Profile/ProfileInfo/useProfile';
/**
 * `ProfilePage` is a component that displays the profile page for a user. The user can be the authenticated user looking at their own profile, or the profile of another user. The username is determined from the URL parameters.
 *
 * The profile page displays the user's profile information and a list of posts.
 *
 * Uses `useParams` hook from `react-router-dom` to get the username from the URL parameters.
 * Uses the `useProfile` hook to get the profile user, whether the user is authenticated, and the loading state.
 *
 * @component
 * @example
 * Example usage of ProfilePage component
 * <ProfilePage />
 *
 * @returns {JSX.Element} A JSX element representing the profile page.
 */
const ProfilePage = () => {
  let { username } = useParams();
  username = username || '';
  const { profileUser, isAuthUser, loading } = useProfile(username);
  console.log(profileUser);
  return (
    <div className='ttr-profile'>
      {profileUser && (
        <div className='border border-bottom-0 h-100'>
          <Loader loading={loading} size='fs-2' />
          <ProfileInfo
            profileUser={profileUser}
            isAuthUser={isAuthUser}
            loading={loading}
          />
          <ProfilePosts userId={profileUser.id} username={username} />
        </div>
      )}
    </div>
  );
};
export default memo(ProfilePage);
