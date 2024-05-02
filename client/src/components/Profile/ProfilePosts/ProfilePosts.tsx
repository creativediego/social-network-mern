import React, { memo, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useFetchPosts } from './useFetchPosts';
import PostsList from '../../Posts/PostsLists/PostsList';
import ProfileNav from '../ProfileNav/ProfileNav';
import Loader from '../../Loader/Loader';

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
const ProfilePosts = ({ userId, username }: ProfilePostsProps): JSX.Element => {
  const { posts, likedPosts, loading, lastElementRef, hasMore } =
    useFetchPosts(userId);

  return (
    <>
      {
        <div className='p2'>
          <ProfileNav username={username} />
          <Routes>
            <Route path='/posts' element={<PostsList posts={posts} />} />
            <Route path='/likes' element={<PostsList posts={likedPosts} />} />
          </Routes>
          {loading && <Loader loading={loading} message='Loading Posts' />}
          {!loading && hasMore && <div ref={lastElementRef}></div>}
        </div>
      }
    </>
  );
};

export default memo(ProfilePosts);
