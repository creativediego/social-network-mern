import React from 'react';
import { NewPost, Loader, Posts, AvatarImage } from '../../components';
import { useAppSelector } from '../../redux/hooks';
import { selectAuthUser } from '../../redux/userSlice';
import { useAllPosts } from '../../hooks/useAllPosts';

const HomePage = (): JSX.Element | null => {
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
            <NewPost />
          </div>
        )}
      </div>
      <Loader loading={loading} message={'Loading Posts'} />
      <Posts posts={posts} />
    </section>
  );
};
export default HomePage;
