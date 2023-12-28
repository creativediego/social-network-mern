import React, { memo } from 'react';
import PostStats from '../PostStats/PostStats';
import PostImage from '../../PostImage/PostImage';
import PostVideo from '../PostVideo/PostVideo';
import { Link } from 'react-router-dom';
import { AvatarImage } from '../../AvatarImage/AvatarImage';
import { IPost } from '../../../interfaces/IPost';
import moment from 'moment';
import { PostProvider } from '../../../hooks/usePost';
import PostOptions from '../PostOptions/PostOptions';
import { useAuthUser } from '../../../hooks/useAuthUser';
import PostContent from '../PostContent/PostContent';

interface PostProps {
  post: IPost;
}
/**
 * Displays a post with all of its information, including Author, time, and stats (likes, dislikes, etc).
 */
const Post = ({ post }: PostProps): JSX.Element => {
  const postWordArray = post.post.split(' ');
  const { user } = useAuthUser();
  return (
    post && (
      <>
        <PostProvider initialState={post}>
          <li className='p-2 ttr-post list-group-item d-flex rounded-0'>
            <Link to={`/${post.author.username}/posts`}>
              <div className='pe-2'>
                <AvatarImage
                  profilePhoto={post.author.profilePhoto}
                  size={50}
                />
              </div>
            </Link>
            <div className='w-100'>
              <div className='d-flex justify-content-between'>
                <div>
                  <p className='fw-bold ttr-post-title'>
                    {/* This link and the one above will naviagate a user's the profile page for the user who posted this post.  */}
                    <Link
                      to={`/${post.author.username}/posts`}
                      className='text-decoration-none'
                    >
                      {`${post.author.name} @${post.author.username} `}
                    </Link>
                    <span className='text-dark'>
                      {moment(post.createdAt).fromNow()}
                    </span>
                  </p>
                </div>
                {user.id === post.author.id && <PostOptions />}
              </div>
              <PostContent content={postWordArray} />
              {post.youtube && <PostVideo />}
              {post.image && (
                <PostImage imageURL={post.image} deletable={false} />
              )}
              <PostStats />
            </div>
          </li>
        </PostProvider>
      </>
    )
  );
};
export default memo(Post);
