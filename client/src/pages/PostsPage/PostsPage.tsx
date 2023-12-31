import React from 'react';
import { NewPost, Loader, PostsList, AvatarImage } from '../../components';
import { useAppSelector } from '../../redux/hooks';
import { selectAuthUser } from '../../redux/userSlice';
import { useAllPosts } from '../../hooks/useAllPosts';

/**
 * `PostsPage` is a component that renders the home page with a list of posts.
 *
 * It uses the `useAllPosts` hook to get all posts and their loading status,
 * and the `useAppSelector` hook with `selectAuthUser` to get the authenticated user.
 *
 * The page displays a header, an avatar image, a `NewPost` component for creating new posts,
 * a `Loader` component that shows the loading status, and a `PostsList` component that lists all posts.
 *
 * @component
 * @example
 * Example usage of PostsPage component
 * <PostsPage />
 *
 * @returns {JSX.Element} A JSX element representing the home page with a list of posts.
 */
const PostsPage = (): JSX.Element => {
  const { posts, loading } = useAllPosts();
  const authUser = useAppSelector(selectAuthUser);
  return (
    <section className='ttr-home'>
      <div className='border border-bottom-0'>
        <h5 className='fw-bold p-2'>Home</h5>
        {posts && (
          <div className='d-flex'>
            <div className='p-2'>
              <AvatarImage profilePhoto={authUser.profilePhoto} size={70} />
            </div>
            <NewPost /> {/* Component to create a new post */}
          </div>
        )}
      </div>
      <Loader loading={loading} message={'Loading Posts'} />
      {posts && <PostsList posts={posts} />}
    </section>
  );
};
export default PostsPage;
