import React, { memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useProfileTuits } from './useProfileTuits';
import Tuits from '../../Tuits';
import ProfileNav from '../ProfileNav/ProfileNav';

const ProfileTuits = ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  const { myTuits, likedTuits, dislikedTuits, loading } =
    useProfileTuits(userId);
  return (
    <>
      {userId && !loading && (
        <div className='p2'>
          <ProfileNav username={username} />
          <Routes>
            <Route path='/tuits' element={<Tuits tuits={myTuits} />} />
            <Route path='/likes' element={<Tuits tuits={likedTuits} />} />
            <Route path='/dislikes' element={<Tuits tuits={dislikedTuits} />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default memo(ProfileTuits);
