import React from 'react';
import { usePost } from '../Post/hooks/usePost';
import { LikeButton } from '../../../components';

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
const PostStats = (): JSX.Element | null => {
  const { post } = usePost();
  return post ? (
    <div className='row mt-2'>
      <div className='col'>
        <div className='d-flex'>
          <LikeButton />
        </div>
      </div>
    </div>
  ) : null;
};

export default PostStats;
