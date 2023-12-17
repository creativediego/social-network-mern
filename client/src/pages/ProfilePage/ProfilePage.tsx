import React from 'react';
import { useParams } from 'react-router-dom';
import { Loader, ProfileInfo, ProfilePosts } from '../../components';
import { useProfile } from '../../components/Profile/ProfileInfo/useProfile';
const ProfilePage = () => {
  let { username } = useParams();
  username = username || '';
  const { profileUser, isAuthUser, loading, followUser, unfollowUser } =
    useProfile(username);

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
export default ProfilePage;
