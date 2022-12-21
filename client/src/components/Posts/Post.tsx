import React, { memo } from 'react';
import PostStats from './PostStats';
import PostImage from '../PostImage/PostImage';
import PostVideo from './PostVideo';
import { Link } from 'react-router-dom';
import { AvatarImage } from '../AvatarImage/AvatarImage';
import { IPost } from '../../interfaces/IPost';
import moment from 'moment';
import { PostProvider } from '../../hooks/usePost';
import PostMoreButton from './PostMoreButton';
import { useAuthUser } from '../../hooks/useAuthUser';

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
        <PostProvider post={post}>
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
                  {/* {user.id === post.author.id ? ( // only delete if post belongs to user
                <i
                  onClick={() => handleDeletePost(post.id)}
                  className='fa-duotone fa-trash-xmark btn fa-2x fa-pull-right fs-6 text-dark'
                ></i>
              ) : null} */}
                  <p className='fw-bold ttr-post-title'>
                    {/* {post.author && post.author.name} */}
                    {/* This link and the one above will naviagate a user's the profile page for the user who posted this post.  */}
                    <Link
                      to={`/${post.author.username}/posts`}
                      className='text-decoration-none'
                    >
                      {`${post.author.name || post.author.firstName} @${
                        post.author.username
                      } `}
                    </Link>
                    <span className='text-dark'>
                      {moment(post.createdAt).fromNow()}
                    </span>
                  </p>
                </div>
                {user.id === post.author.id && <PostMoreButton />}
              </div>
              {postWordArray.map((word, index) =>
                word[0] === '#' ? ( // style the hashtag word and create link
                  <Link
                    to={`/search/?q=${word.split('#')[1]}`} // exclude hash from url
                    className='text-decoration-none'
                    key={index}
                  >
                    <span key={index} className='text-primary'>
                      {' '}
                      {word}
                    </span>
                  </Link>
                ) : (
                  <span key={index}> {word}</span>
                )
              )}
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