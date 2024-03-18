import React, { memo } from 'react';
import { NewPost, Loader, PostsList, AvatarImage } from '../../components';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useFetchPosts } from '../../components/Profile/ProfilePosts/useFetchPosts';

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
  const { user } = useAuthUser();
  const {
    homePagePosts: posts,
    loading,
    lastElementRef,
    hasMore,
  } = useFetchPosts(user.id);
  return (
    <section className='ttr-home'>
      <div className='border border-bottom-0'>
        <h5 className='fw-bold p-2'>Home</h5>
        {posts && (
          <div className='d-flex'>
            <div className='p-2'>
              <AvatarImage profilePhoto={user.profilePhoto} size={70} />
            </div>
            <NewPost /> {/* Component to create a new post */}
          </div>
        )}
      </div>
      {posts && <PostsList posts={posts} />}
      {hasMore && <div ref={lastElementRef}></div>}
      <Loader loading={loading} message={'Loading Posts'} />
    </section>
  );
};
export default memo(PostsPage);
