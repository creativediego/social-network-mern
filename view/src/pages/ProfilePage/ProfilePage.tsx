import React from 'react';
import { useParams } from 'react-router-dom';
import { ProfileInfo, ProfileTuits } from '../../components';
import { useProfile } from '../../components/Profile/ProfileInfo/useProfile';
const ProfilePage = () => {
  let { username } = useParams();
  username = username || '';
  const { profileUser, isAuthUser, loading } = useProfile(username);

  return (
    <div className='ttr-profile'>
      {profileUser && (
        <div className='border border-bottom-0'>
          <ProfileInfo
            profileUser={profileUser}
            isAuthUser={isAuthUser}
            loading={loading}
          />
          <ProfileTuits userId={profileUser.id} username={username} />
        </div>
      )}
    </div>
  );
};
export default ProfilePage;
