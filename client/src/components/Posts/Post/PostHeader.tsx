import moment from 'moment';
import { IPost } from '../../../interfaces/IPost';
import { Link } from 'react-router-dom';

/**
 * `PostHeaderProps` is the props object passed to the `PostHeader` component.
 *
 * @typedef {Object} PostHeaderProps
 * @property {IPost} post - The post object.
 */
interface PostHeaderProps {
  post: IPost;
}

/**
 * `PostHeader` is a component that displays the header of a post.
 *
 * It renders a link to the author's posts, with the author's name, username, and the relative time of post creation.
 *
 * @component
 * @example
 * Example usage of PostHeader component
 * <PostHeader post={samplePost} />
 *
 * @param {PostHeaderProps} props - The properties that define the PostHeader component.
 * @param {IPost} props.post - The post object.
 *
 * @returns {JSX.Element} A JSX element representing the post's header.
 */
const PostHeader = ({ post }: PostHeaderProps): JSX.Element => {
  return (
    <>
      <p className='fw-bold ttr-post-title'>
        <Link
          to={`/${post.author.username}/posts`}
          className='text-decoration-none'
        >
          {`${post.author.name} @${post.author.username} `}
        </Link>
        <span className='text-dark'>{moment(post.createdAt).fromNow()}</span>
      </p>
    </>
  );
};

export default PostHeader;
