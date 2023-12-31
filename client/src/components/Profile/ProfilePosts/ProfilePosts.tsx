import React, { memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useProfilePosts } from './useProfilePosts';
import PostsList from '../../Posts/PostsLists/PostsList';
import ProfileNav from '../ProfileNav/ProfileNav';

/**
 * `ProfilePostsProps` is an interface that defines the properties for the `ProfilePosts` component.
 *
 * @interface
 * @property {string} userId - The ID of the user whose posts are being displayed. This is a required property.
 * @property {string} username - The username of the user whose posts are being displayed. This is a required property.
 */
interface ProfilePostsProps {
  userId: string;
  username: string;
}

/**
 * `ProfilePosts` is a component that displays the posts of a user as well as the liked and disliked by the user.
 *
 * It uses the `useProfilePosts` hook to get the posts of the user.
 * It also uses the `Routes` and `Route` components from `react-router-dom` to manage the routing of the posts, likes, and dislikes.
 *
 * @component
 * @example
 * Example usage of ProfilePosts component
 * <ProfilePosts userId="123" username="john_doe" />
 *
 * @param {ProfilePostsProps} props - The properties that define the profile posts.
 * @param {string} props.userId - The ID of the user whose posts are being displayed.
 * @param {string} props.username - The username of the user whose posts are being displayed.
 *
 * @returns {JSX.Element} A JSX element representing the profile posts.
 */
const ProfilePosts = ({ userId, username }: ProfilePostsProps) => {
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
