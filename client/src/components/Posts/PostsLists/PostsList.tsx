import React, { memo } from 'react';
import '.././Posts.scss';
import Post from '../Post/Post';
import { IPost } from '../../../interfaces/IPost';

/**
 * `PostsProps` is the props object passed to the `PostsList` component.
 *
 * @typedef {Object} PostsProps
 * @property {IPost[]} posts - An array of post objects.
 * @property {boolean} [showOptions] - Optional flag to show/hide post options like edit and delete.
 */

interface PostsProps {
  posts: IPost[];
  showOptions?: boolean; // Flag to show/hide post options like edit and delete
}

/**
 * `PostsList` is a component that displays a list of posts.
 *
 * It maps over the `posts` prop and renders a `Post` component for each post.
 *
 * @component
 * @example
 * Example usage of PostsList component
 * <PostsList posts={samplePosts} />
 *
 * @param {PostsProps} props - The properties that define the PostsList component.
 * @param {IPost[]} props.posts - An array of post objects.
 *
 * @returns {JSX.Element} A JSX element representing the list of posts.
 */
const PostsList = ({ posts }: PostsProps): JSX.Element => {
  return (
    <>
      <ul className='ttr-posts list-group'>
        {posts &&
          Object.values(posts).map((post: IPost) => {
            return post ? <Post key={post.id} post={post} /> : null;
          })}
      </ul>
    </>
  );
};

export default memo(PostsList);
