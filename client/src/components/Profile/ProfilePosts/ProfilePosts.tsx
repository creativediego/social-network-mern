import React, { memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useProfilePosts } from './useProfilePosts';
import Posts from '../../Posts/Posts/Posts';
import ProfileNav from '../ProfileNav/ProfileNav';

const ProfilePosts = ({
  userId,
  username,
}: {
  userId: string;
  username: string;
}) => {
  const { myPosts, likedPosts, dislikedPosts, loading } =
    useProfilePosts(userId);
  return (
    <>
      {userId && !loading && (
        <div className='p2'>
          <ProfileNav username={username} />
          <Routes>
            <Route path='/posts' element={<Posts posts={myPosts} />} />
            <Route path='/likes' element={<Posts posts={likedPosts} />} />
            <Route path='/dislikes' element={<Posts posts={dislikedPosts} />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default memo(ProfilePosts);
