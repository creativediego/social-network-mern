import React from 'react';
import { useAllPosts } from '../../hooks/useAllPosts';
import { IPost } from '../../interfaces/IPost';
import './WhatsHappeningView.css';
import moment from 'moment';
import PostContent from '../../components/Posts/PostContent';

const WhatsHappeningWidget = (): JSX.Element => {
  const { posts } = useAllPosts();
  const sortByLikes = (a: IPost, b: IPost) => {
    if (a.stats.likes < b.stats.likes) {
      return 1;
    }
    if (a.stats.likes < b.stats.likes) {
      return -1;
    }
    return 0;
  };
  return (
    <div className='ttr-whats-happening p-2'>
      {/* <div className='ttr-search position-relative'>
        <i className='fas fa-search position-absolute'></i>
        <input
          className='bg-secondary bg-opacity-10 border-0 form-control form-control-lg rounded-pill ps-5'
          placeholder='Search Poster'
        />
      </div> */}
      <div className='bg-secondary bg-opacity-10 ttr-rounded-15px mt-2 p-2'>
        <h5>Popular Posts</h5>
        {posts
          .sort(sortByLikes)
          .slice(0, 3)
          .map((post) => {
            return (
              <div
                key={post.id}
                className='ttr-whats-happening-post d-flex mb-3'
              >
                <div className='flex-grow-1'>
                  <h3 className='fs-6 fw-lighter'>
                    {moment(post.createdAt).fromNow()}
                  </h3>
                  <div className='fw-bold mb-2 pe-1'>
                    <PostContent content={post.post.split(' ')} />
                  </div>
                  <h4 className='fs-6 fw-lighter'>
                    <i className='far fa-heart ttr-stat-icon'></i>{' '}
                    {post.stats.likes} likes
                  </h4>
                </div>
                <div>
                  <img
                    alt='user avatar'
                    src={post.author.profilePhoto}
                    className='ttr-rounded-15px ttr-user-logo'
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
export default WhatsHappeningWidget;
