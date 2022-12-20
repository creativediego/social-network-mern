import React, { memo } from 'react';
import './Posts.scss';
import Post from './Post';
import { IPost } from '../../interfaces/IPost';

interface PostsProps {
  posts: IPost[];
  showOptions?: boolean;
}
/**
 * A container to display a list of posts.
 */
const Posts = ({ posts }: PostsProps): JSX.Element => {
  return (
    <div>
      <ul className='ttr-posts list-group'>
        {posts &&
          Object.values(posts).map((post: IPost) => {
            return post ? <Post key={post.id} post={post} /> : null;
          })}
      </ul>
    </div>
  );
};

export default memo(Posts);
