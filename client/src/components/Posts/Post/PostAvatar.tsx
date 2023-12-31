import React from 'react';
import { Link } from 'react-router-dom';
import { AvatarImage } from '../../../components';
import { IPost } from '../../../interfaces/IPost';

/**
 * `PostAuthorAvatarProps` is the props object passed to the `PostAuthorAvatar` component.
 *
 * @typedef {Object} PostAuthorAvatarProps
 * @property {IPost} post - The post object.
 */
interface PostAuthorAvatarProps {
  post: IPost;
}

/**
 * `PostAuthorAvatar` is a component that displays the avatar of the author of a post.
 *
 * It renders a link to the author's posts, with the author's avatar as the link content.
 *
 * @component
 * @example
 *  Example usage of PostAuthorAvatar component
 * <PostAuthorAvatar post={samplePost} />
 *
 * @param {PostAuthorAvatarProps} props - The properties that define the PostAuthorAvatar component.
 * @param {IPost} props.post - The post object.
 *
 * @returns {JSX.Element} A JSX element representing the author's avatar.
 */
const PostAuthorAvatar = ({ post }: PostAuthorAvatarProps): JSX.Element => {
  return (
    <Link to={`/${post.author.username}/posts`}>
      <div className='pe-2'>
        <AvatarImage profilePhoto={post.author.profilePhoto} size={50} />
      </div>
    </Link>
  );
};

export default PostAuthorAvatar;
