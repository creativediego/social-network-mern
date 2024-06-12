import { memo } from 'react';
import PostStats from '../PostStats/PostStats';
import PostImage from '../PostImage/PostImage';
import { PostProvider } from './hooks/usePost';
import PostOptions from '../PostOptions/PostOptions';
import { useAuthUser } from '../../../hooks/useAuthUser';
import PostContent from './PostContent';
import { postService } from '../../../services/postService';
import PostHeader from './PostHeader';
import PostAuthorAvatar from './PostAvatar';
import { IPost } from '../../../interfaces/IPost';

/**
 * `PostProps` is the props object passed to the `Post` component.
 *
 * @typedef {Object} PostProps
 * @property {IPost} post - The post object to be rendered.
 */
export interface PostProps {
  post: IPost;
}

/**
 * `Post` is a component that renders a single post.
 *
 * It displays the post's author avatar, header, content, image, and stats.
 * If the post's author is the currently authenticated user, it also displays post options.
 *
 * @component
 * @example
 * Example usage of Post component
 * <Post post={samplePost} />
 *
 * @param {PostProps} props - The properties that define the Post component.
 * @param {IPost} props.post - The post object to be rendered. It should conform to the IPost interface.
 *
 * @returns {JSX.Element} A JSX element representing a single post.
 */

const Post = ({ post }: PostProps): JSX.Element => {
  const postWordArray = post.post.split(' '); // Split the post into an array of words
  const { user } = useAuthUser();

  return (
    post && (
      <PostProvider initialPost={post} postService={postService}>
        <li className='p-2 ttr-post list-group-item d-flex rounded-0'>
          <PostAuthorAvatar post={post} />
          <div className='w-100'>
            <div className='d-flex justify-content-between'>
              <PostHeader post={post} />
              {user.id === post.author.id ? <PostOptions /> : null}
            </div>
            <PostContent content={postWordArray} />
            <PostImage imageURL={post.image} deletable={false} />
            <PostStats />
          </div>
        </li>
      </PostProvider>
    )
  );
};

export default memo(Post);
