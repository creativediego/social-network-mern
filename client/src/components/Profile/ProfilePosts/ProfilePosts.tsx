import React, { memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useProfilePosts } from './useProfilePosts';
import PostsList from '../../Posts/PostsLists/PostsList';
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
            <Route path='/posts' element={<PostsList posts={myPosts} />} />
            <Route path='/likes' element={<PostsList posts={likedPosts} />} />
            <Route
              path='/dislikes'
              element={<PostsList posts={dislikedPosts} />}
            />
          </Routes>
        </div>
      )}
    </>
  );
};

export default memo(ProfilePosts);
